import { fetchImages } from "./lib/data";
import Grid from "@/components/home/Grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const raw_images = await fetchImages();

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Grid images={raw_images} />
    </main>
  );
}

