import AdminAccessButton from "@/components/AdminAccessButton";
import Footer from "@/components/Footer";
import SiteLogo from "@/components/SiteLogo";
import SiteNav from "@/components/SiteNav";
import { Syncopate, Sora, Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { Metadata, Viewport } from "next";
import { auth } from "@root/auth";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "fr_FR",
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    images: [{ url: "/circumpolar-mark.png", width: 512, height: 512, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/circumpolar-mark.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="fr" className={`${syncopate.variable} ${sora.variable} ${geist.variable} dark`}>
      <body className="font-body antialiased text-white min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Aller au contenu
        </a>
        <SessionProvider session={session}>
          {modal}
          <header className="max-w-7xl mx-auto p-4 pb-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 w-full">
            <div className="font-title text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.12em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 m-0 min-w-0">
              <SiteLogo />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <SiteNav />
              <AdminAccessButton isAuth={!!session} />
            </div>
          </header>
          <main id="main-content" className="max-w-7xl mx-auto p-4 flex-1 flex flex-col w-full">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
