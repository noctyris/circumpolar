// app/image/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCldImageUrl } from "next-cloudinary";
import { fetchSingleImage } from "@/app/lib/data";
import ImagePageClient from "@/components/ImagePageClient";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = parseId((await params).id);
  if (id === null) return {};

  const [image] = await fetchSingleImage(id);
  if (!image) return {};

  const title = image.title || image.target;
  const description = [image.target, image.optics, image.camera]
    .filter(Boolean)
    .join(" — ");

  const imageUrl = getCldImageUrl({
    width: 1200,
    height: 630,
    src: image.publicid,
    quality: "auto",
    format: "jpg",
    transformations: [],
    crop: "fill",
  });

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ImagePage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) notFound();

  const images = await fetchSingleImage(id);
  const image = images[0];

  if (!image) notFound();

  return <ImagePageClient image={image} />;
}
