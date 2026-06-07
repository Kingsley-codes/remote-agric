import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

type Step = "asset" | "checkout" | "confirmation";

interface BreadcrumbsProps {
  produceId?: string | null;
  currentStep: Step;
}

const getSteps = (produceId?: string | null) => [
  { key: "asset", label: "Select Asset", href: `/opportunities/${produceId}` },
  {
    key: "checkout",
    label: "Checkout",
    href: `/checkout?produceId=${produceId}`,
  },
  {
    key: "confirmation",
    label: "Confirmation",
    href: `/checkout/verifyPayment`,
  },
];

export default function Breadcrumbs({
  produceId,
  currentStep,
}: BreadcrumbsProps) {
  const steps = getSteps(produceId);
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm mb-4 text-gray-500">
        {steps.map((step, i) => {
          const isCurrent = step.key === currentStep;
          const isPast = i < currentIndex;

          return (
            <span key={step.key} className="flex items-center gap-2">
              {isCurrent ? (
                <span className="font-bold text-primary">{step.label}</span>
              ) : isPast ? (
                <Link
                  href={step.href}
                  className="hover:text-primary transition"
                >
                  {step.label}
                </Link>
              ) : (
                <span className="text-gray-400">{step.label}</span>
              )}
              {i < steps.length - 1 && <FiChevronRight />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
