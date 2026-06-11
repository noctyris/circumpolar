import ProtectedImage from "@/components/ProtectedImage";
import { Picture, formatDuration } from "@/types";

export default function ImagePageClient({ image }: { image: Picture }) {
  return (
    <main className="min-h-screen bg-black p-10">
      <h1 className="text-3xl md:text-4xl font-title uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">{image.target}{image.title && " – "}{image.title}</h1>
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
                     <p className="font-mono text-sm">{image.focal_length}</p>
                     <p className="text-[10px] font-geist text-white/30 uppercase">Valeur d{"'"}ouverture (nombre f)</p>
                     <p className="font-mono text-sm">{image.f_number}</p>
                  </div>
               </div>
            </section>

            <section className="space-y-4">
                 <h3 className="font-sora text-xs uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Equipment</h3>
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
  );
}
