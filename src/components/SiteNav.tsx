"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Galerie", desktopOnly: true },
  { href: "/about", label: "À propos", desktopOnly: false },
] as const;

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="flex items-center gap-1">
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/" || pathname.startsWith("/image/")
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`${
              link.desktopOnly ? "hidden sm:inline-flex" : "inline-flex"
            } items-center rounded-full px-2.5 py-2 font-subtitle text-[10px] uppercase tracking-widest transition ${
              active
                ? "bg-indigo-500/15 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(129,140,248,0.25)]"
                : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className={`mr-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
