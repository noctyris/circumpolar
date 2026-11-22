import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Camera, MapPin, Sparkles, Telescope } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Noctyris, astrophotographe amateur : ciel profond, lunaire, solaire et planétaire. Le matériel, la méthode et les liens derrière Circumpolar.",
  openGraph: {
    type: "profile",
    title: "À propos — Noctyris",
    description:
      "Astrophotographe amateur, je documente mes nuits entre ciel profond et système solaire.",
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
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 font-subtitle text-[10px] uppercase tracking-widest text-white/50 transition hover:border-white/20 hover:text-white"
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
            Je photographie le ciel comme on tient un carnet de bord : une nuit, un objet, des conditions,
            des essais — et ce que l’on finit par comprendre en regardant les fichiers de près.
          </p>

          <p className="max-w-2xl font-body text-sm leading-relaxed text-white/45 sm:text-base">
            Mes images sont réalisées principalement dans le Morbihan, sous un ciel de campagne autour de la
            classe de Bortle 4. Le ciel profond reste mon terrain de jeu principal, mais le lunaire, le solaire
            et le planétaire me ramènent régulièrement au télescope.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/50">
              <Telescope className="h-3.5 w-3.5" />
              Newton 150/750
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/50">
              <MapPin className="h-3.5 w-3.5" />
              Morbihan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/50">
              <Camera className="h-3.5 w-3.5" />
              Ciel profond & planétaire
            </span>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/45">
              Pourquoi Circumpolar
            </h2>
            <div className="space-y-4 font-body text-sm leading-relaxed text-white/60 sm:text-base">
              <p>
                Circumpolar est né d’une envie simple : sortir les images du disque dur et garder, avec elles,
                ce qui les rend uniques. Un titre seul ne raconte pas une nuit. Le temps d’intégration, le filtre,
                la monture ou la qualité du ciel le font beaucoup mieux.
              </p>
              <p>
                Chaque fiche rassemble donc les métadonnées d’acquisition et, quand elle existe, une version
                annotée qui remet les objets célestes dans leur contexte. C’est autant un portfolio qu’un
                carnet d’observation que je peux relire des mois plus tard.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/45">
              Comment je travaille
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Acquérir",
                  text: "Préparer la cible, soigner la mise en station, empiler les poses jusqu’à ce que le signal tienne.",
                },
                {
                  title: "Traiter",
                  text: "Siril pour le ciel profond, AutoStakkert! et Registax pour les plans serrés, puis les finitions.",
                },
                {
                  title: "Documenter",
                  text: "Noter le matériel, les filtres et le ciel pour que chaque image raconte sa propre nuit.",
                },
              ].map((step, index) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent-light">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-subtitle text-xs uppercase tracking-widest text-white/80">{step.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-white/50">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-white/10 pb-2 font-subtitle text-xs uppercase tracking-[0.25em] text-white/45">
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
            <h2 className="font-subtitle text-xs uppercase tracking-[0.25em] text-white/45">Le matériel</h2>
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
            <h2 className="font-subtitle text-xs uppercase tracking-[0.25em] text-white/45">Me retrouver</h2>
            <ul className="mt-3 divide-y divide-white/5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 py-2.5 font-body text-sm text-white/60 transition hover:text-white"
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
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/35 transition hover:text-white"
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
