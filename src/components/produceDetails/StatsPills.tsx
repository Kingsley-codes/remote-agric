import { FaCircle } from "react-icons/fa";

interface StatsPillsProps {
  roi: string;
  duration: number;
  category: string;
}

export function StatsPills({ roi, duration, category }: StatsPillsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Annualized ROI" value={roi} highlight />
      <Stat label="Duration" value={`${duration} Months`} />
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
          Risk Level
        </p>
        <div className="flex items-center gap-2">
          <FaCircle className="text-green-500 text-xs" />
          <p className="text-gray-900 text-2xl font-semibold">Low</p>
        </div>
      </div>
      <Stat label="Type" value={category} />
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-semibold ${
          highlight ? "text-green-500" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
