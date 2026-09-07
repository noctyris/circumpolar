import { Picture } from "@/types";
import ProtectedImage from "../ProtectedImage";
import Link from "next/link";
import { SquarePen } from "lucide-react";

export default function Image({ image }: { image: Picture }) {
    return (
        <Link href={`/dashboard/edit/${image.id}`} scroll={false}>
            <div className="cursor-zoom-in w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 group relative">
                <ProtectedImage
                    src={image.publicid}
                    width="400" 
                    classname="w-full h-auto block duration-500 group-hover:scale-105 group-hover:opacity-50"
                />

                <div className="absolute inset-x-0 bottom-0 z-20 p-4 translate-y-4 transition-all duration-500 ease-out group-hover:translate-y-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p className="font-subtitle text-xs font-light tracking-[0.2em] text-white">{image.title || image.target}</p>
                            {image.title && <p className="font-subtitle text-xs font-light tracking-[0.2em] text-white/50">{image.target}</p>}
                        </div>
                        <div className="bg-black rounded-l-full p-2 pr-7 duration-500 border-5 border-white/30 translate-x-25 group-hover:translate-x-7">
                            <SquarePen />
                        </div>
                    </div>
                    
                    <div className="h-[1px] w-0 bg-accent mt-2 transition-all duration-700 delay-100 group-hover:w-full" />
                </div>
  
            <div className="absolute inset-0 z-30" onContextMenu={(e) => e.preventDefault()} /></div>
        </Link>
    )
}

