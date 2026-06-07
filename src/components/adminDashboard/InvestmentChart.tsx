"use client";

import { useState } from "react";

export default function InvestmentChart() {
  const [activePeriod, setActivePeriod] = useState("6M");

  const periods = [
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "ALL", value: "ALL" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="xl:col-span-2 bg-white dark:bg-slate-800/50 p-6 lg:p-8 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Investment Inflow
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Growth over the last 6 months
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setActivePeriod(period.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activePeriod === period.value
                  ? "bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Graphic */}
      <div className="relative w-full aspect-2/1 max-h-75">
        <svg
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 50"
        >
          {/* Grid Lines */}
          <line
            className="text-slate-100 dark:text-slate-700"
            stroke="currentColor"
            strokeDasharray="2 2"
            strokeWidth="0.5"
            x1="0"
            x2="100"
            y1="0"
            y2="0"
          />
          <line
            className="text-slate-100 dark:text-slate-700"
            stroke="currentColor"
            strokeDasharray="2 2"
            strokeWidth="0.5"
            x1="0"
            x2="100"
            y1="12.5"
            y2="12.5"
          />
          <line
            className="text-slate-100 dark:text-slate-700"
            stroke="currentColor"
            strokeDasharray="2 2"
            strokeWidth="0.5"
            x1="0"
            x2="100"
            y1="25"
            y2="25"
          />
          <line
            className="text-slate-100 dark:text-slate-700"
            stroke="currentColor"
            strokeDasharray="2 2"
            strokeWidth="0.5"
            x1="0"
            x2="100"
            y1="37.5"
            y2="37.5"
          />
          <line
            className="text-slate-200 dark:text-slate-600"
            stroke="currentColor"
            strokeWidth="0.5"
            x1="0"
            x2="100"
            y1="50"
            y2="50"
          />

          {/* Gradient Defs */}
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#46ec13" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#46ec13" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area Path */}
          <path
            d="M0,40 C10,38 20,25 30,28 C40,31 50,15 60,18 C70,21 80,10 90,5 C95,2 100,8 100,8 V50 H0 Z"
            fill="url(#chartGradient)"
          />

          {/* Stroke Path */}
          <path
            d="M0,40 C10,38 20,25 30,28 C40,31 50,15 60,18 C70,21 80,10 90,5 C95,2 100,8 100,8"
            fill="none"
            stroke="#46ec13"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />

          {/* Points */}
          <circle
            className="fill-white dark:fill-slate-800 stroke-[#46ec13]"
            cx="30"
            cy="28"
            r="1.5"
            strokeWidth="1"
          />
          <circle
            className="fill-white dark:fill-slate-800 stroke-[#46ec13]"
            cx="60"
            cy="18"
            r="1.5"
            strokeWidth="1"
          />
          <circle
            className="fill-white dark:fill-slate-800 stroke-[#46ec13]"
            cx="90"
            cy="5"
            r="1.5"
            strokeWidth="1"
          />
        </svg>

        {/* X Axis Labels */}
        <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
