import { Picture } from "@/types";
import ProtectedImage from "../ProtectedImage";
import Link from "next/link";

export default function AstroImage({ image }: { image: Picture }) {
  return (
    <Link href={`/image/${image.id}`} scroll={false}>
      <div className="cursor-zoom-in w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 group relative">
        <ProtectedImage
          src={image.publicid}
          width="400" 
          classname="w-full h-auto block duration-500 group-hover:scale-105 group-hover:opacity-50"
        />
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <span className="font-subtitle text-xs font-light tracking-[0.2em] text-white uppercase">
            {image.title}
          </span>
          
          <div className="h-[1px] w-0 bg-accent mt-2 transition-all duration-700 delay-100 group-hover:w-full" />
        </div>
  
        <div className="absolute inset-0 z-30" onContextMenu={(e) => e.preventDefault()} />
      </div>
    </Link>
  )
}

