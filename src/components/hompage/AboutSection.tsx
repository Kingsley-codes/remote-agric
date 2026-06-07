"use client";

import { BiCheckCircle } from "react-icons/bi";
import { CldImage } from "next-cloudinary";

export default function About() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <CldImage
                src="i5ny8nyxro1rnt9cqxp9"
                alt="Aerial view of organized farm rows during sunset"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
              About Grow Africa
            </h2>
            <h3 className="text-3xl md:text-4xl  text-gray-800 font-bold mb-6 leading-tight">
              Bridging the Gap Between Investors and Sustainable Farming
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Grow Africa is more than an investment platform; it&apos;s a
              movement to revolutionize food security and economic prosperity
              across the continent. We empower local communities by providing
              the resources needed for high-yield, sustainable farming.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We partner directly with farming communities and supply them with
              the inputs they need — such as seeds, fertilisers and farm
              resources — instead of giving out cash. This approach ensures
              accountability, productivity and long-term sustainability.
            </p>

            <div className="space-y-4 text-gray-800">
              <div className="flex gap-4">
                <BiCheckCircle className="text-primary text-2xl shrink-0" />
                <p className="font-medium italic">
                  On a mission to empower 50,000+ local smallholder farmers
                </p>
              </div>
              <div className="flex gap-4">
                <BiCheckCircle className="text-primary text-2xl shrink-0" />
                <p className="font-medium italic">
                  Utilizing data-driven agricultural techniques
                </p>
              </div>
              <div className="flex gap-4">
                <BiCheckCircle className="text-primary text-2xl shrink-0" />
                <p className="font-medium italic">
                  Direct impact on UN Sustainable Development Goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
