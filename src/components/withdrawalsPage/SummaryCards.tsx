import {
  MdPendingActions,
  MdAccountBalanceWallet,
  MdPayments,
} from "react-icons/md";
import { TrendingUp, Info } from "lucide-react";

const cards = [
  {
    icon: <MdPendingActions size={20} className="text-orange-600" />,
    iconBg: "bg-orange-100",
    badge: "Action Required",
    badgeClass: "text-orange-600 bg-orange-50",
    label: "Total Pending Withdrawals",
    value: "42",
    trend: "+5% from last week",
    trendIcon: <TrendingUp size={12} />,
    trendClass: "text-primary",
  },
  {
    icon: <MdAccountBalanceWallet size={20} className="text-primary" />,
    iconBg: "bg-primary/10",
    badge: "Growth Green",
    badgeClass: "text-primary bg-primary/5",
    label: "Total Paid Out (Today)",
    value: "₦1,250,000",
    trend: "+12.4% daily growth",
    trendIcon: <TrendingUp size={12} />,
    trendClass: "text-primary",
  },
  {
    icon: <MdPayments size={20} className="text-blue-600" />,
    iconBg: "bg-blue-100",
    badge: "Most Efficient",
    badgeClass: "text-blue-600 bg-blue-50",
    label: "Most Used Payout Method",
    value: "Bank Transfer",
    trend: "84% of total volume",
    trendIcon: <Info size={12} />,
    trendClass: "text-slate-400",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 ${card.iconBg} rounded-lg`}>{card.icon}</div>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${card.badgeClass}`}
            >
              {card.badge}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">
            {card.label}
          </p>
          <p className="text-3xl font-black text-slate-900">{card.value}</p>
          <div
            className={`mt-4 flex items-center gap-1 text-xs font-bold ${card.trendClass}`}
          >
            {card.trendIcon}
            <span>{card.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
