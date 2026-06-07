"use client";

import { FaQuoteLeft } from "react-icons/fa";
import { CldImage } from "next-cloudinary";


export default function StorySection() {
  return (
    <section className="bg-white py-24 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <CldImage
            src="vymffrut2yhhjlqxjpsh"
            alt="Nigerian farmer smiling"
            width={600}
            height={400}
            className="w-full h-auto rounded-xl shadow-gray-800 shadow-2xl object-cover"
          />
</div>
        <div className="w-full md:w-1/2">
          <h2 className="text-primary text-4xl font-semibold mb-8">Our Story</h2>
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p>
              What started as a simple investment platform in Lagos has blossomed into a full-scale agricultural venture. Many Nigerians wanted to invest in agriculture but lacked time and expertise.
            </p>
            <p>
              Talented rural farmers were trapped in cycles of subsistence farming due to lack of modern machinery and capital.
            </p>
            <div className="pl-6 border-l-4 border-[#D96C3A] italic text-xl font-medium text-slate-800 py-2 flex items-center gap-2">
              <FaQuoteLeft /> &quot;We didn&apos;t just want to build a Fintech app; we wanted to build a bridge that felt like soil under your fingernails.&quot;
            </div>
            <p>
              Today, Agrofund Hub manages dozens of farm clusters across Nigeria, using IoT technology to give remote farmers real-time updates while ensuring local partners receive fair wages, training, and a stake in the harvest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}