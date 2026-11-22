import type { MetadataRoute } from "next";
import { fetchImages } from "./lib/data";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pictures = await fetchImages();

  const pictureEntries: MetadataRoute.Sitemap = pictures.map((picture) => {
    const date = picture.upload_date ? new Date(picture.upload_date) : new Date();
    return {
      url: absoluteUrl(`/image/${picture.id}`),
      lastModified: Number.isNaN(date.getTime()) ? new Date() : date,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...pictureEntries,
  ];
}
