import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchSingleImage } from "@/app/lib/data";
import ImageModalClient from "@/components/ImageModalClient";
import { ImageModalSkeleton } from "@/components/Skeletons";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function ModalContent({ id }: { id: number }) {
  const images = await fetchSingleImage(id);
  const image = images[0];

  if (!image) notFound();

  return <ImageModalClient image={image} />;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) notFound();

  return (
    <Suspense fallback={<ImageModalSkeleton />}>
      <ModalContent id={id} />
    </Suspense>
  );
}
