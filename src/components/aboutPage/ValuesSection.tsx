"use client";

import { FaEye, FaHeart, FaKey, FaUsers } from "react-icons/fa";

const values = [
  { icon: FaEye, title: "Transparency", desc: "Every kobo accounted for. Real-time monitoring and reporting for every farm cycle.", color: "primary" },
  { icon: FaHeart, title: "Impact", desc: "Measuring success by the improved livelihoods of our rural host communities.", color: "terracotta" },
  { icon: FaKey, title: "Ownership", desc: "Fostering a sense of pride and stewardship for both investors and farmers.", color: "ochre" },
  { icon: FaUsers, title: "Community", desc: "Building a network that shares knowledge, risks, and the joy of a bountiful harvest.", color: "primary" },
];

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  terracotta: {
    bg: "bg-terracotta/10",
    text: "text-terracotta",
  },
  ochre: {
    bg: "bg-ochre/10",
    text: "text-ochre",
  },
};

export default function ValuesSection() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-background-light">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-primary text-4xl font-semibold mb-4">Core Values</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide our growth and ensure we remain grounded in our mission.</p>
      </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        {values.map(({ icon: Icon, title, desc, color }) => {
          const c = colorMap[color as keyof typeof colorMap];

          return (
            <div
              key={title}
              className="bg-white p-8 rounded-lg shadow-md hover:-translate-y-1 transition-transform"
            >
              <div
                className={`w-12 h-12 ${c.bg} rounded-full flex items-center justify-center mb-6`}
              >
                <Icon className={`${c.text} text-xl`} />
              </div>

              <h4 className={`font-bold text-xl mb-3 ${c.text}`}>{title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}