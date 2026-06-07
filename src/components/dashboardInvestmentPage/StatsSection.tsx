import { FaWallet } from "react-icons/fa";

interface StatsSectionProps {
  totalInvestedAmount: number;
  totalActiveInvestments: number;
  totalProjectedROI: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StatsSection({
  totalInvestedAmount,
  totalActiveInvestments,
  totalProjectedROI,
}: StatsSectionProps) {
  // Compute a rough progress bar: cap at 100%
  const roiProgress = Math.min(
    (totalProjectedROI / totalInvestedAmount) * 100 * 5,
    100,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Invested */}
      <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-[#d5e7cf] shadow-sm">
        <div className="flex justify-between items-start">
          <p className="text-gray-400 text-sm font-medium">Total Invested</p>
          <span className="bg-[#eaf3e7] text-[#5e9a4c] p-1.5 rounded-lg">
            <FaWallet className="text-xl" />
          </span>
        </div>
        <p className="text-[#111b0d] text-3xl font-bold tracking-tight mt-2">
          {formatCurrency(totalInvestedAmount)}
        </p>
        <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
          {totalActiveInvestments} active investment
          {totalActiveInvestments !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Projected ROI */}
      <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-[#d5e7cf] shadow-sm">
        <div className="flex justify-between items-start">
          <p className="text-gray-400 text-sm font-medium">Projected ROI</p>
        </div>
        <p className="text-[#111b0d] text-3xl font-bold tracking-tight mt-2">
          +{formatCurrency(totalProjectedROI)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
          <div
            className="bg-[#46ec13] h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${roiProgress}%` }}
          />
        </div>
      </div>

      {/* Active Cycles */}
      <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-[#d5e7cf] shadow-sm">
        <div className="flex justify-between items-start">
          <p className="text-gray-400 text-sm font-medium">Active Cycles</p>
        </div>
        <p className="text-[#111b0d] text-3xl font-bold tracking-tight mt-2">
          {totalActiveInvestments}
        </p>
        <p className="text-xs text-[#5e9a4c] font-medium mt-1">
          All investments in pre-harvest stage
        </p>
      </div>
    </div>
  );
}
