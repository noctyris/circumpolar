// app/image/[id]/page.tsx
import { fetchSingleImage } from "@/app/lib/data";
import ImagePageClient from "@/components/ImagePageClient";

export default async function ImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await fetchSingleImage(id);
  const image = images[0];

  if (!image) return null;

  return <ImagePageClient image={image} />;
}

