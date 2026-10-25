import { v2 as cloudinary } from "cloudinary";
import { auth } from "@root/auth";
import { buildParamsToSign } from "@/app/lib/cloudinary-signature";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const result = buildParamsToSign(
    (body as { paramsToSign?: unknown } | null)?.paramsToSign,
  );

  if (!result.ok) {
    // `received` permet de diagnostiquer ce que le widget envoie réellement
    // quand Cloudinary change ses paramètres.
    console.error(
      `Signature Cloudinary refusée (${result.error}) — reçu : ${result.received.join(", ") || "aucun"}`,
    );
    return Response.json(
      { error: result.error, received: result.received },
      { status: 400 },
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    result.params,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return Response.json({ signature });
}
