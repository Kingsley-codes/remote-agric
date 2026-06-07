import { FaHeadset } from "react-icons/fa";

export function NeedHelpCard() {
  return (
    <div className="bg-green-50 rounded-xl p-5 border border-green-200 flex items-start gap-4">
      <div className="bg-green-100 p-2 rounded-lg text-green-600">
        <FaHeadset />
      </div>

      <div>
        <h4 className="font-bold text-sm text-gray-900">
          Need help investing?
        </h4>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Our investment advisors are available to guide you.
        </p>
        <a
          href="#"
          className="text-xs font-bold text-green-600 hover:underline"
        >
          Chat with Support
        </a>
      </div>
    </div>
  );
}
