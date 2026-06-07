import { Logo } from "../../lib";

const logos: Logo[] = [
  { icon: "agriculture", name: "AgriTech" },
  { icon: "shield", name: "SecureFarm" },
  { icon: "newspaper", name: "DailyFinance" },
  { icon: "pets", name: "LivestockPro" },
];

export default function TrustSection() {
  return (
    <section className="w-full border-y border-[#eaf3e7] dark:border-white/5 bg-white dark:bg-surface-dark/50 py-10">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm font-medium text-text-muted mb-6">OUR PARTNERS</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xl font-bold font-display"
            >
              <span className="material-symbols-outlined">{logo.icon}</span>
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
