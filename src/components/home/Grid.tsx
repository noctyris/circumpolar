"use client";

import Masonry from 'react-masonry-css';
import AstroImage from "@/components/home/AstroImage";
import { Picture } from '@/types';

const breakpointColumnsObj = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 1
};

export default function Grid({ images }: { images: Picture[] }) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-4" 
      columnClassName="pl-4 bg-clip-padding"
    >
      {images.map((img) => (
        <div key={img.id} className="mb-4">
          <AstroImage image={img} />
        </div>
      ))}
    </Masonry>
  );
}

