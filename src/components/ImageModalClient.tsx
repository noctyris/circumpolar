"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ProtectedImage from "./ProtectedImage";
import { Picture, formatDuration } from "@/types";

export default function ImageModalClient({ image }: { image: Picture }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      className="m-0 h-screen w-screen max-w-none bg-black/60 backdrop-blur-md text-white p-0 border-none outline-none overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-full w-full">
        <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative" onClick={onDismiss}>
          <div className="relative z-10 w-full max-w-4xl aspect-square bg-white/5 rounded-lg border border-white/10 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-mono italic">
              <ProtectedImage
                src={image.publicid}
                width="" 
                classname="w-full h-auto block duration-500"
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-[450px] h-full bg-[#0a0a0a]/90 border-l border-white/10 p-8 flex flex-col shadow-2xl backdrop-blur-2xl">
          <button onClick={onDismiss} className="self-end p-2 hover:bg-white/10 rounded-full mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2">
            <header>
              <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-2 block">{image.target_category}</span>
              <h2 className="font-syncopate text-3xl leading-tight tracking-tighter">{image.title || image.target}</h2>
              {image.title && <span className="text-accent font-mono text-l tracking-[0.3em] uppercase my-2 block text-center text-white/60">– {image.target} –</span>}
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
      </div>
    </dialog>
  );
}
