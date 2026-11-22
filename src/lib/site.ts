export const siteName = "Circumpolar";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://circumpolar.dpdns.org"
).replace(/\/+$/, "");

export const siteDescription =
  "Portfolio d'astrophotographie : ciel profond, lunaire, solaire et planétaire. Détails d'acquisition, matériel et traitement de chaque image.";

export function absoluteUrl(pathname = "/"): string {
  return `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
