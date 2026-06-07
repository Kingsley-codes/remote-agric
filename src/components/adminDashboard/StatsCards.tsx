import { LuTrendingUp, LuMinus } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";

const stats = [
  {
    title: "Total Investments",
    value: "$4,250,000",
    change: "+12%",
    changeBg: "bg-green-100 dark:bg-green-900/30",
    changeColor: "text-green-700 dark:text-green-400",
    TrendIcon: LuTrendingUp,
    positive: true,
  },
  {
    title: "Total Users",
    value: "12,450",
    change: "+5%",
    changeBg: "bg-green-100 dark:bg-green-900/30",
    changeColor: "text-green-700 dark:text-green-400",
    TrendIcon: LuTrendingUp,
    positive: true,
  },
  {
    title: "Active Opportunities",
    value: "85",
    change: "0%",
    changeBg: "bg-slate-100 dark:bg-slate-700",
    changeColor: "text-slate-600 dark:text-slate-300",
    TrendIcon: LuMinus,
    positive: null,
  },
  {
    title: "Pending Withdrawals",
    value: "$125,000",
    change: "Action",
    changeBg: "bg-red-100 dark:bg-red-900/30",
    changeColor: "text-red-700 dark:text-red-400",
    TrendIcon: FiAlertTriangle,
    positive: false,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white h-40 relative dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-center hover:border-primary/30 hover:shadow-md transition-all duration-200"
        >
          {/* Badge — absolutely positioned, excluded from flow */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-2.5 py-1 rounded-lg ${stat.changeBg} ${stat.changeColor} text-xs font-semibold flex items-center gap-1`}
            >
              <stat.TrendIcon className="w-3.5 h-3.5" />
              {stat.change}
            </span>
          </div>

          {/* Centered content */}
          <div className="px-7">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
