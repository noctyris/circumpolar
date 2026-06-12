import { fetchImages } from "./lib/data";
import Grid from "@/components/home/Grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const raw_images = await fetchImages();

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="font-title text-3xl md:text-5xl uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 m-4 mb-0">Circumpolar</h1>
      <Grid images={raw_images} />
    </main>
  );
}

