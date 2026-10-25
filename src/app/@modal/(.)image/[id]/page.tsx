import { notFound } from "next/navigation";
import { fetchSingleImage } from "@/app/lib/data";
import ImageModalClient from "@/components/ImageModalClient";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) notFound();

  const images = await fetchSingleImage(id);
  const image = images[0];

  if (!image) notFound();

  return <ImageModalClient image={image} />;
}
