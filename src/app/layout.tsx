import { Syncopate, Sora, Geist } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from "next";
import { auth } from "@root/auth"
import "./globals.css";

const syncopate = Syncopate({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-syncopate',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: "Circumpolar",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="fr" className={`${syncopate.variable} ${sora.variable} ${geist.variable} dark`}>
      <body
        className="font-geist antialiased text-white"
      >
        <h1 className="font-title text-3xl md:text-5xl uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 m-4 mb-0">Circumpolar</h1>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
