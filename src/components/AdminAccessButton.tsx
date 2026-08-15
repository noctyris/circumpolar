"use client";

import { House, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminAccessButton({ isAuth }: { isAuth: boolean } ) {
    const pathname = usePathname();

    return (
        <>
            {pathname === "/" && (
                <Link href={isAuth ? "/dashboard" : "/login"} className="hover:underline">
                    {isAuth ? <LayoutDashboard /> : <LogIn />}
                </Link>
            )}
            {pathname !== "/" && (
                <Link href="/" className="hover:underline">
                    <House />
                </Link>
            )}
        </>
    )
}
