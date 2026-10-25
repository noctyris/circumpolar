import AdminAccessButton from '@/components/AdminAccessButton';
import Footer from "@/components/Footer"
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://circumpolar.dpdns.org";
const siteDescription =
    "Portfolio d'astrophotographie : ciel profond, lunaire, solaire et planétaire. Détails d'acquisition, matériel et traitement de chaque image.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Circumpolar",
        template: "%s — Circumpolar",
    },
    description: siteDescription,
    openGraph: {
        type: "website",
        siteName: "Circumpolar",
        locale: "fr_FR",
        url: siteUrl,
        title: "Circumpolar",
        description: siteDescription,
    },
    twitter: {
        card: "summary_large_image",
        title: "Circumpolar",
        description: siteDescription,
    },
};

export default async function RootLayout({
    children, modal
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="fr" className={`${syncopate.variable} ${sora.variable} ${geist.variable} dark`}>
            <body
                className="font-geist antialiased text-white min-h-screen flex flex-col"
            >
                <SessionProvider session={session}>{modal}<div id="modal-root" />
                    <header className="max-w-7xl mx-auto p-4 pb-0 flex items-center justify-between w-full">
                        <h1 className="font-title text-3xl md:text-5xl uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 m-4">Circumpolar</h1>
                        <AdminAccessButton isAuth={!!session} />
                    </header>
                    <main className="max-w-7xl mx-auto p-4 flex-1 flex flex-col w-full">
                        {children}
                    </main>
                    <Footer />
                </SessionProvider>
            </body>
        </html>
    );
}
