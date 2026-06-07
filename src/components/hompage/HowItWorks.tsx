import { Step } from "@/lib";
import { FaSearch, FaRegUser, FaWallet } from "react-icons/fa";

const steps: Step[] = [
  {
    icon: <FaSearch />,
    title: "1. Choose What You Want to Farm",
    description:
      "Select from available crops or livestock. Decide how many units you want to cultivate.",
  },
  {
    icon: <FaRegUser />,
    title: "2. We Assign Trusted Farmers",
    description:
      "We engage experienced farmers to cultivate your chosen crops or livestock. They handle all the work while you track progress through our platform.",
  },
  {
    icon: <FaWallet />,
    title: "3. Harvest or Sell at Maturity",
    description:
      "When the cycle ends, choose to receive the farm produce or let us sell it for you and pay you your capital plus a fixed return.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-12 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 text-center md:text-4xl">
            Invest in African Agriculture From Anywhere
          </h2>
          <p className="text-sm md:text-base text-gray-700 mx-auto text-center max-w-2xl">
            You choose what to farm. We connect you with real producers who do
            the work. You decide whether to receive the harvest or sell it for
            profit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex flex-col gap-4 rounded-2xl border border-[#d5e7cf] bg-gray-100 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/40 text-gray-200 hover:text-white hover:border-0 group-hover:bg-primary transition-colors">
                <span className="text-2xl">{step.icon}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-800">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
