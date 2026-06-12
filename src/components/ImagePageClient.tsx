import ProtectedImage from "@/components/ProtectedImage";
import Link from "next/link";
import { Picture, formatDuration } from "@/types";

export default function ImagePageClient({ image }: { image: Picture }) {
  return (
    <>
    <header className="p-10 flex w-full">
      <h1 className="text-3xl md:text-4xl font-title uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 w-full">{image.target}{image.title && " – "}{image.title}</h1>
      <Link href="/" className="self-end p-2 hover:bg-white/10 rounded-full mb-4 flex-1">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </Link>
    </header>
    <main className="min-h-screen p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 bg-white/5 rounded-2xl aspect-square flex items-center justify-center">
          <ProtectedImage
            src={image.publicid}
            width="" 
            classname="w-full h-auto block duration-500"
          />
        </div>
        <div className="w-full lg:w-96 overflow-y-auto space-y-8 pr-2">
          <header>
            <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-2 block">{image.target_category}</span>
          </header>
          <section className="space-y-4">
            <h3 className="font-sora text-xs uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Détails</h3>
            <div className="grid grid-cols-2 gap-4">
              {image.capture_data && (
                 <div className="space-y-1">
                   <p className="text-[10px] font-geist text-white/30 uppercase">Capture{image.capture_data.length>1 && "s"}</p>
                     {/*<p className="font-mono text-sm"></p>*/}
                     {image.capture_data.map((f, i) => (
                        <p key={i} className="font-mono text-sm">{f.filter}: {formatDuration(f.exposure)} * {f.count}</p>
                     ))}
                  </div>
              )}
                  <div className="space-y-1">
                     <p className="text-[10px] font-geist text-white/30 uppercase">Longueur focale</p>
                     <p className="font-mono text-sm">{image.focal_length} mm</p>
                     <p className="text-[10px] font-geist text-white/30 uppercase">Valeur d{"'"}ouverture</p>
                     <p className="font-mono text-sm">f/{image.f_number}</p>
                  </div>
               </div>
            </section>

            <section className="space-y-4">
                 <h3 className="font-sora text-xs uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Équipement</h3>
                 <ul className="text-sm font-geist text-white/70 space-y-2 italic">
                   <li>{image.optics}</li>
                   <li>{image.camera}</li>
                   <li>{image.accessories}</li>
                   <li>{image.mount}</li>
                 </ul>
              </section>
        </div>
      </div>
    </main>
    </>
  );
}
