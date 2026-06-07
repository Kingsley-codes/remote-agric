import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const items: FAQItem[] = [
  {
    question: "When do I get my returns?",
    answer:
      "Returns (capital plus profit) are paid automatically into your Grow Africa wallet at the end of the 9-month cycle.",
  },
  {
    question: "Is my investment insured?",
    answer:
      "Yes. This farm cycle is insured against natural disasters, fire and theft. The certificate is available in the documents section.",
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
      </div>
    </section>
  );
}
