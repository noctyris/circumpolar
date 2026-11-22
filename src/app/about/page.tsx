import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Camera, MapPin, Sparkles, Telescope } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Noctyris, photos du ciel depuis le Morbihan. Ciel profond, Lune, Soleil, planétaire, et les infos derrière chaque image.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "À propos — Noctyris",
    description:
      "Je fais des photos du ciel depuis le Morbihan, surtout en ciel profond. Mon matériel, comment je travaille et mes liens.",
  },
};

const gear = [
  { label: "Optique principale", value: "Perl Bellatrix Newton 150/750" },
  { label: "Monture", value: "SynScan EQ3 motorisée" },
  { label: "Caméras", value: "Caméras dédiées type ZWO ASI" },
  { label: "Accessoires", value: "Barlow 2×, réducteur de focale ×0,5, filtres" },
];

const software = ["Siril", "AutoStakkert!", "Registax", "GIMP"];

const socials = [
  { label: "GitHub", href: "https://github.com/noctyris" },
  { label: "Instagram", href: "https://instagram.com/hoel__" },
  { label: "Bluesky", href: "https://bsky.app/profile/noctyris.bsky.social" },
];

export default function AboutPage() {
  return (
    <article className="w-full pb-10">
      <div className="flex items-center py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-subtitle text-[10px] uppercase tracking-widest text-white/65 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Galerie
        </Link>
      </div>

      <header className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 hidden opacity-25 sm:block">
          <Image
            src="/circumpolar-mark.png"
            alt=""
            width={320}
            height={320}
            className="h-72 w-72 rounded-full object-contain"
          />
        </div>

        <div className="relative max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent-light">
            <Sparkles className="h-3.5 w-3.5" />
            Astrophotographie amateur
          </p>

          <h1 className="bg-gradient-to-b from-white to-white/40 bg-clip-text font-title text-4xl uppercase leading-none tracking-[0.08em] text-transparent sm:text-5xl">
            Noctyris
          </h1>

          <p className="max-w-2xl font-body text-base leading-relaxed text-white/60 sm:text-lg">
            Je fais des photos du ciel depuis le Morbihan. Surtout du ciel profond, mais ça m’arrive aussi de
            viser la Lune, le Soleil ou les planètes.
          </p>

          <p className="max-w-2xl font-body text-sm leading-relaxed text-white/60 sm:text-base">
            Ici, je range les images avec les infos de la nuit. Le ciel est pas trop mauvais par ici,
            Bortle 4 environ, donc y a déjà de quoi faire.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/65">
              <Telescope className="h-3.5 w-3.5" />
              Newton 150/750
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/65">
              <MapPin className="h-3.5 w-3.5" />
              Morbihan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/65">
              <Camera className="h-3.5 w-3.5" />
              Ciel profond & planétaire
            </span>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">
              Pourquoi ce site
            </h2>
            <div className="space-y-4 font-body text-sm leading-relaxed text-white/60 sm:text-base">
              <p>
                J’ai créé Circumpolar parce que mes images restaient tout le temps sur le disque dur. Et quand je
                les rouvre des mois après, je me souviens pas toujours du temps de pose, du filtre ou du ciel
                qu’il y avait.
              </p>
              <p>
                Du coup, chaque fiche garde les infos de la prise de vue avec l’image, et la version annotée
                quand j’en ai une. Ça me fait un portfolio et un carnet d’observation en même temps.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">
              Comment je travaille
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Sur le terrain",
                  text: "Je prépare la cible, je soigne la mise en station et j’empile les poses jusqu’à avoir assez de signal.",
                },
                {
                  title: "Au traitement",
                  text: "Siril pour le ciel profond, AutoStakkert! et Registax pour la Lune, le Soleil et les planètes, puis GIMP pour les finitions.",
                },
                {
                  title: "Les notes",
                  text: "Je note le matériel, les filtres et les conditions. Comme ça, chaque image garde le contexte de sa nuit.",
                },
              ].map((step, index) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent-light">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-subtitle text-xs uppercase tracking-widest text-white/80">{step.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-white/65">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">
              Les logiciels
            </h2>
            <div className="flex flex-wrap gap-2">
              {software.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/65">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">Le matériel</h2>
            <dl className="mt-4 space-y-4">
              {gear.map((item) => (
                <div key={item.label} className="space-y-1">
                  <dt className="font-body text-[10px] uppercase tracking-widest text-white/40">{item.label}</dt>
                  <dd className="font-body text-sm leading-relaxed text-white/70">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-subtitle text-xs uppercase tracking-[0.25em] text-white/60">Me retrouver</h2>
            <ul className="mt-3 divide-y divide-white/5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 py-2.5 font-body text-sm text-white/70 transition hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/noctyris/circumpolar"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/70 transition hover:text-white"
            >
              Voir le code du site
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </section>
        </aside>
      </div>
    </article>
  );
}
