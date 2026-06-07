export default function PortfolioMix() {
  const portfolioItems = [
    {
      name: "Produce/Crops",
      value: "$2.9M",
      percentage: 70,
      color: "bg-primary",
    },
    {
      name: "Livestock",
      value: "$1.3M",
      percentage: 30,
      color: "bg-slate-300 dark:bg-slate-600",
    },
  ];

  return (
    <div className="xl:col-span-1 bg-white dark:bg-slate-800/50 p-6 lg:p-8 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Portfolio Mix
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Crops vs Livestock distribution
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center py-6">
        <div className="relative size-48">
          <svg
            className="transform -rotate-90 w-full h-full"
            viewBox="0 0 100 100"
          >
            {/* Crops Segment (70%) */}
            <circle
              className="transition-all duration-1000 ease-out"
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#46ec13"
              strokeDasharray="219.91"
              strokeDashoffset="65.97"
              strokeWidth="12"
            />
            {/* Livestock Segment (30%) */}
            <circle
              className="dark:stroke-slate-600 opacity-20"
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#142210"
              strokeDasharray="219.91"
              strokeDashoffset="153.94"
              strokeWidth="12"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              70%
            </span>
            <span className="text-xs font-medium text-slate-500">Crops</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <span className={`size-3 rounded-full ${item.color}`}></span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
