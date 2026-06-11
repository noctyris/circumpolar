import { fetchSingleImage } from "@/app/lib/data";
import ImageModalClient from "@/components/ImageModalClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await fetchSingleImage(id);
  const image = images[0];

  if (!image) return null;

  return <ImageModalClient image={image} />;
}

