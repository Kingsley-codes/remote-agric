import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const items: FAQItem[] = [
  {
    question: "When do I get my returns?",
    answer:
      "Returns (capital plus profit) are paid automatically into your Remote Agric wallet at the end of the cycle.",
  },
  {
    question: "Is my farm ownership insured?",
    answer:
      "Yes. This farm cycle is insured against natural disasters, fire and theft. The insurance is provided by a reputable insurance company and covers the farm's assets and produce.",
  },
  {
    question: "Can I sell my farm ownership?",
    answer:
      "Yes. You can sell your farm ownership units at the end of the cycle. You can also choose to receive the produce instead of selling your ownership. The option to sell or receive produce will be available in your dashboard when the project reaches that stage.",
  },
];

export function FAQAccordion() {
  return (
    <section className="border-y border-gray-200 my-5 pt-5 pb-12">
      <h3 className="text-xl font-bold mb-4 text-gray-900">
        Frequently Asked Questions
      </h3>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <details
            key={index}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-900 list-none">
              {item.question}
              <FaChevronDown className="transition-transform group-open:rotate-180" />
            </summary>

            <div className="px-4 pb-4 text-gray-500 text-sm">{item.answer}</div>
          </details>
        ))}

        <p className="text-sm text-gray-500 mt-4">
          If you have any other questions, please{" "}
          <Link href="/faqs" className="text-green-500 hover:underline">
            visit our FAQs page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
