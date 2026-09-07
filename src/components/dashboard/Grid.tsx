"use client";

import Masonry from 'react-masonry-css';
import Image from "@/components/dashboard/Image"
import { Picture } from '@/types';

const breakpointColumnsObj = {
  default: 4,
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
          <Image image={img} />
        </div>
      ))}
    </Masonry>
  );
}

