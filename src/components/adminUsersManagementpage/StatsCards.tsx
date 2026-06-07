import {
  MdGroup,
  MdAttachMoney,
  MdHourglassEmpty,
  MdTrendingUp,
} from "react-icons/md";

const stats = [
  {
    label: "Total Users",
    value: "1,240",
    icon: MdGroup,
    iconBg: "bg-[#eaf3e7]",
    iconColor: "text-[#5e9a4c]",
    footer: (
      <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
        <MdTrendingUp className="text-base" /> +12% this month
      </p>
    ),
  },
  {
    label: "Active Investors",
    value: "850",
    icon: MdAttachMoney,
    iconBg: "bg-[#eaf3e7]",
    iconColor: "text-[#5e9a4c]",
  },
  {
    label: "Top Investor",
    value: "John Doe",
    icon: MdHourglassEmpty,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

export default function StatsCards() {
  return (
    <div className="grid px-4 grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map(({ label, value, icon: Icon, iconBg, iconColor, footer }) => (
        <div
          key={label}
          className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-[#d5e7cf] shadow-sm"
        >
          <div className="flex justify-between items-start">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <span className={`${iconBg} ${iconColor} p-1.5 rounded-lg`}>
              <Icon className="text-xl" />
            </span>
          </div>
          <p className="text-gray-800 text-3xl font-bold tracking-tight mt-2">
            {value}
          </p>
          {footer}
        </div>
      ))}
    </div>
  );
}
