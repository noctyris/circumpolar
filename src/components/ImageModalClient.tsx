"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import ProtectedImage from "./ProtectedImage";
import ImageDetails from "./ImageDetails";
import { Picture } from "@/types";

export default function ImageModalClient({ image }: { image: Picture }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function onDismiss() {
    router.back();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      className="m-0 h-[100dvh] w-screen max-w-none overflow-hidden border-none bg-black/60 p-0 text-white outline-none backdrop-blur-md"
    >
      <div className="flex h-full w-full flex-col md:flex-row">
        <div className="relative flex h-[50dvh] shrink-0 items-center justify-center p-4 md:h-full md:flex-1 md:p-10">
          <div className="max-h-full max-w-full overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl">
            <ProtectedImage
              src={image.publicid}
              alt={`${image.target}${image.title ? ` — ${image.title}` : ""} — ${image.target_category}`}
              width="1600"
              classname="max-h-[42dvh] w-auto max-w-full object-contain md:max-h-[78vh]"
            />
          </div>

          <button
            onClick={onDismiss}
            aria-label="Fermer"
            className="absolute right-3 top-3 z-30 rounded-full border border-white/10 bg-black/60 p-2.5 text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white md:right-5 md:top-5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <aside className="flex min-h-0 w-full flex-1 flex-col border-t border-white/10 bg-[#0a0a0a]/95 md:w-[430px] md:flex-none md:border-l md:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-7">
            <ImageDetails image={image} />

            <Link
              href={`/image/${image.id}`}
              className="mt-8 inline-flex items-center gap-2 font-subtitle text-[10px] uppercase tracking-widest text-white/40 transition hover:text-white"
            >
              Voir la page complète
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </dialog>
  );
}
