import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Invested" value="$12,450" badge="+12%" />

      <StatCard title="Active Projects" value="4" />

      <StatCard title="Total ROI Earned" value="$3,200" badge="+5%" />

      <StatCard title="Next Payout" value="Oct 24, 2023" />
    </div>
  );
}
