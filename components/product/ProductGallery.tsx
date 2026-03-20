"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  badge?: string;
}

export function ProductGallery({ images, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image */}
      <div className="flex-grow bg-surface-container-low border border-outline-variant/30 p-4 relative group">
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-primary-container text-primary px-3 py-1 font-label text-[10px] tracking-widest font-bold border border-primary/20">
              {badge}
            </div>
          </div>
        )}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 ${i === activeIndex ? "bg-primary" : "border border-outline-variant"}`}
            />
          ))}
        </div>
        <Image
          src={images[activeIndex].src}
          alt={images[activeIndex].alt}
          width={600}
          height={600}
          className="w-full h-[600px] object-cover grayscale contrast-125 opacity-90 group-hover:grayscale-0 transition-all duration-500"
        />
        {/* Decorative Crosshairs */}
        <span className="absolute top-0 left-0 p-1 text-outline-variant/50">
          <span className="material-symbols-outlined text-xs">add</span>
        </span>
        <span className="absolute top-0 right-0 p-1 text-outline-variant/50">
          <span className="material-symbols-outlined text-xs">add</span>
        </span>
        <span className="absolute bottom-0 left-0 p-1 text-outline-variant/50">
          <span className="material-symbols-outlined text-xs">add</span>
        </span>
        <span className="absolute bottom-0 right-0 p-1 text-outline-variant/50">
          <span className="material-symbols-outlined text-xs">add</span>
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`border p-1 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-colors ${
              i === activeIndex
                ? "border-primary"
                : "border-outline-variant/30 hover:border-outline"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={96}
              height={96}
              className="w-full h-full object-cover grayscale"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
