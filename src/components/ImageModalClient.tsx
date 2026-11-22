"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import ImageViewer from "./ImageViewer";
import ImageDetails from "./ImageDetails";
import useBodyScrollLock from "./useBodyScrollLock";
import { Picture } from "@/types";

export default function ImageModalClient({ image }: { image: Picture }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const title = image.title || image.target;

  useBodyScrollLock(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      aria-label={`${title} — ${image.target_category}`}
      className="m-0 h-[100dvh] w-screen max-w-none overflow-hidden border-none bg-black/60 p-0 text-white outline-none backdrop-blur-md"
    >
      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:p-8">
          <ImageViewer
            image={image}
            className="flex h-full min-h-0 flex-col gap-3"
            frameClassName="min-h-0 flex-1"
          />

          <button
            onClick={onDismiss}
            aria-label="Fermer"
            className="absolute right-3 top-3 z-30 rounded-full border border-white/10 bg-black/60 p-2.5 text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white sm:right-5 sm:top-5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <aside className="flex max-h-[50dvh] min-h-0 w-full shrink-0 flex-col border-t border-white/10 bg-[#0a0a0a]/95 lg:h-full lg:max-h-none lg:w-[400px] lg:border-l lg:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-7">
            <ImageDetails image={image} headingLevel="h2" />

            <a
              href={`/image/${image.id}`}
              className="mt-8 inline-flex items-center gap-2 font-subtitle text-[10px] uppercase tracking-widest text-white/50 transition hover:text-white"
            >
              Voir la page complète
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </aside>
      </div>
    </dialog>
  );
}
