import StatCard from "./StatCard";

interface StatsGridProps {
  totalFarmValue: number;
  activeProjects: number;
  projectedRoi: number;
  nextPayout: string;
}

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export default function StatsGrid({
  totalFarmValue,
  activeProjects,
  projectedRoi,
  nextPayout,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Farm Value" value={formatNaira(totalFarmValue)} />

      <StatCard title="Active Projects" value={String(activeProjects)} />

      <StatCard title="Projected ROI" value={formatNaira(projectedRoi)} />

      <StatCard title="Next Payout" value={nextPayout} />
    </div>
  );
}
