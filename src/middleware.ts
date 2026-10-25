// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Le cookie de session est préfixé `__Secure-` dès que la requête arrive en
 * HTTPS. On le déduit du protocole réel (en-tête `x-forwarded-proto` derrière
 * un proxy, sinon l'URL) plutôt que de `NEXTAUTH_URL`, qui peut être absente en
 * production — le middleware ne retrouvait alors jamais le cookie.
 */
function isSecureRequest(req: NextRequest): boolean {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }
  return req.nextUrl.protocol === "https:";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Les routes d'authentification doivent rester publiques, sinon plus de login.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecureRequest(req),
  });
  const isAuth = Boolean(token && token.id);

  if (isAuth) {
    return NextResponse.next();
  }

  // Une API consommée en fetch doit répondre en JSON, pas par une redirection
  // HTML (défense en profondeur : les handlers vérifient aussi la session).
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
