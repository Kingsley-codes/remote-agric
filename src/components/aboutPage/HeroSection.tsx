"use client";

import { CldImage } from "next-cloudinary";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-100 w-full flex items-end">
      <div className="absolute inset-0 z-0">
        <CldImage
          className="w-full h-full object-cover"
          src="cug8dpm46xur3ld9f4kw"
          fill
          alt="Cassava plantation"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/70 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 pb-16 w-full">
        <span className="inline-block bg-[#D96C3A] text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">Our Roots</span>
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
          Bridging Urban Wealth with Rural Productivity
        </h2>
      </div>
    </section>
  );
}