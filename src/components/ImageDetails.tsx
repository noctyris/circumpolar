import type { ReactNode } from "react";
import { Picture, filter_t, formatDuration } from "@/types";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
}

function formatRa(ra: number) {
  const seconds = Math.round((ra / 15) * 3600);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function formatDec(dec: number) {
  const seconds = Math.round(Math.abs(dec) * 3600);
  const degrees = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${dec < 0 ? "−" : "+"}${degrees}° ${String(minutes).padStart(2, "0")}′ ${String(seconds % 60).padStart(2, "0")}″`;
}

function totalExposure(rows: filter_t[]) {
  return rows.reduce((total, row) => {
    const exposure = Number(row.exposure);
    const count = Number(row.count);
    return Number.isFinite(exposure) && Number.isFinite(count)
      ? total + exposure * count
      : total;
  }, 0);
}

function Detail({
  label,
  value,
  mono = true,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="space-y-1">
      <dt className="font-body text-[10px] uppercase tracking-widest text-white/60">{label}</dt>
      <dd className={`text-sm text-white/80 ${mono ? "font-mono" : "font-body"}`}>{value}</dd>
    </div>
  );
}

function ListDetail({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div className="space-y-2">
      <dt className="font-body text-[10px] uppercase tracking-widest text-white/60">{label}</dt>
      <dd className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/70"
          >
            {item}
          </span>
        ))}
      </dd>
    </div>
  );
}

function Section({
  title,
  level,
  children,
}: {
  title: string;
  level: "h2" | "h3";
  children: ReactNode;
}) {
  const Heading = level;

  return (
    <section className="space-y-4">
      <Heading className="border-b border-white/5 pb-2 font-subtitle text-xs uppercase tracking-widest text-white/65">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function ImageDetails({
  image,
  headingLevel = "h1",
}: {
  image: Picture;
  headingLevel?: "h1" | "h2";
}) {
  const Title = headingLevel;
  const sectionLevel = headingLevel === "h1" ? "h2" : "h3";
  const captures = (image.capture_data ?? []).filter(
    (row) => row.filter && Number(row.count) > 0
  );
  const integration = totalExposure(captures);
  const softwares = Array.from(new Set(image.processing_software ?? []));
  const captureDate = formatDate(image.capture_date);
  const uploadDate = formatDate(image.upload_date);
  const hasSky = image.location || image.bortle_class != null || image.ra != null || image.dec != null;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light">
            {image.target_category}
          </span>
          {integration > 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/65">
              {formatDuration(integration)}
            </span>
          )}
        </div>

        <Title className="break-words bg-gradient-to-b from-white to-white/40 bg-clip-text font-title text-2xl uppercase leading-tight tracking-[0.05em] text-transparent sm:text-3xl">
          {image.title || image.target}
        </Title>
        {image.title && <p className="font-mono text-sm text-white/65">{image.target}</p>}
        {captureDate && (
          <p className="font-subtitle text-[11px] uppercase tracking-widest text-white/65">
            {captureDate}
          </p>
        )}
      </header>

      {(captures.length > 0 || image.focal_length != null || image.f_number != null) && (
        <Section title="Acquisition" level={sectionLevel}>
          {captures.length > 0 && (
            <ul className="space-y-2">
              {captures.map((row, index) => (
                <li
                  key={index}
                  className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-body text-sm text-white/80">{row.filter}</span>
                  <span className="font-mono text-xs text-white/65">
                    {row.count} × {formatDuration(row.exposure)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <dl className="grid grid-cols-2 gap-4">
            {integration > 0 && <Detail label="Temps total" value={formatDuration(integration)} />}
            {image.focal_length != null && (
              <Detail label="Focale" value={`${image.focal_length} mm`} />
            )}
            {image.f_number != null && <Detail label="Ouverture" value={`f/${image.f_number}`} />}
          </dl>
        </Section>
      )}

      <Section title="Équipement" level={sectionLevel}>
        <dl className="grid grid-cols-1 gap-4">
          <Detail label="Optique" value={image.optics} mono={false} />
          <Detail label="Caméra" value={image.camera} mono={false} />
          <Detail label="Monture" value={image.mount} mono={false} />
          <ListDetail label="Accessoires" items={image.accessories} />
        </dl>
      </Section>

      {softwares.length > 0 && (
        <Section title="Traitement" level={sectionLevel}>
          <div className="flex flex-wrap gap-2">
            {softwares.map((software) => (
              <span
                key={software}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70"
              >
                {software}
              </span>
            ))}
          </div>
        </Section>
      )}

      {hasSky && (
        <Section title="Localisation & ciel" level={sectionLevel}>
          <dl className="grid grid-cols-1 gap-4">
            <Detail label="Lieu" value={image.location} mono={false} />
            <Detail label="Classe de Bortle" value={image.bortle_class} />
            {image.ra != null && <Detail label="Ascension droite" value={formatRa(image.ra)} />}
            {image.dec != null && <Detail label="Déclinaison" value={formatDec(image.dec)} />}
          </dl>
        </Section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/55">
        <span>Réf. #{image.id}</span>
        {uploadDate && <span>Publiée le {uploadDate}</span>}
      </footer>
    </div>
  );
}
