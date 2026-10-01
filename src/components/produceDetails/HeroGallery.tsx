"use client";

import { useState } from "react";

interface HeroGalleryProps {
  images: string[];
}

export const HeroGallery = ({ images }: HeroGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <>
      {/* ---------------- Mobile ---------------- */}
      <div className="sm:hidden space-y-3">
        {/* main image */}
        <div
          className="w-full aspect-square rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${images[activeIndex]})` }}
        />

        {/* thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-20 aspect-square rounded-lg bg-cover bg-center border
                  ${
                    i === activeIndex ? "border-primary" : "border-transparent"
                  }`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------------- Desktop ---------------- */}
      <div className="hidden sm:grid grid-cols-[110px_1fr] gap-3">
        {/* thumbnails on the LEFT */}
        <div className="flex flex-col gap-3 self-start">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-full aspect-square rounded-lg bg-cover bg-center border
                ${i === activeIndex ? "border-primary" : "border-transparent"}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* big image on the RIGHT */}
        <div
          className="w-full aspect-square self-start rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${images[activeIndex]})` }}
        />
      </div>
    </>
  );
};
