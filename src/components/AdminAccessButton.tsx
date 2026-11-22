"use client";

import { House, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const actionClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition hover:border-indigo-300/30 hover:bg-indigo-500/10 hover:text-white";

export default function AdminAccessButton({ isAuth }: { isAuth: boolean }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const href = isHome ? (isAuth ? "/dashboard" : "/login") : "/";
    const label = isHome
        ? isAuth
            ? "Ouvrir le tableau de bord"
            : "Se connecter"
        : "Retour à la galerie";
    const Icon = isHome ? (isAuth ? LayoutDashboard : LogIn) : House;

    return (
        <Link href={href} aria-label={label} title={label} className={actionClass}>
            <Icon className="h-4 w-4" aria-hidden="true" />
        </Link>
    );
}
