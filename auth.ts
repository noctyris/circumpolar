// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import sql from "@/app/lib/data";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function getUser(username: string) {
  const [user] = await sql`
    SELECT id, username, email, password
    FROM users
    WHERE username = ${username}
    LIMIT 1
  `;
  return user;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ password: z.string().min(6).max(200) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const user = await getUser("admin");
        if (!user || typeof user.password !== "string") return null;

        const password = parsed.data.password;
        const valid = await bcrypt.compare(password, user.password.trim());
        if (!valid) return null;

        return {
          id: String(user.id),
          name: user.username,
          email: user.email ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? "";
        token.email = user.email ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as { id?: string; name?: string; email?: string };
      session.user.id = t.id ?? "";
      session.user.name = t.name ?? "";
      session.user.email = t.email ?? "";
      return session;
    },
  },
});
