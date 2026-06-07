"use client";

import { CldImage } from "next-cloudinary";

const testimonials = [
  {
    name: "Ebuka Nwajiuwa",
    Location: "Oyo, Nigeria",
    message:
      "Being a remote farmer seemed impossible, but this platform made it easy. I funded broilers and pigs, tracked their growth online, and when the cycle ended, I had the option to sell or get the produce. I earned profits and learned so much about farming along the way.",
    avatar: "jcpvvrcgijhgqyilk4ry",
  },
  {
    name: "David Ayobami",
    Location: "Abuja, Nigeria",
    message:
      "I wanted to try farming without investing in land or equipment. This app connected me with producers who took care of my vegetables and poultry. I received high-quality produce and even made a profit when I chose to sell some units—truly hands-on farming from anywhere!",
    avatar: "twnucpgeribcxhmklriu",
  },
  {
    name: "Bimpe Hassan",
    Location: "Lagos, Nigeria",
    message:
      "I never thought I could farm without leaving my city apartment. Through the platform, I chose maize and cassava, and local producers handled everything. At harvest, I received fresh crops straight to my door—it feels like I own a farm from home!",
    avatar: "umkgocfaw9gbxhds2uwg",
  },
];

export default function SuccessStories() {
  return (
    <section className="py-20 bg-[#f6fff7]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Success Stories
        </h2>

        <p className="text-gray-700 pb-7 italic">
          Don&apos;t just take our word for it—here are some real stories from
          our community ...
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.381-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.047 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                  </svg>
                ))}
              </div>

              {/* Message */}
              <p className="text-gray-600 text-sm mb-6">{item.message}</p>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full">
                  <CldImage
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.Location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
