"use client";

import { useEffect, useState } from "react";

interface InvestmentSummary {
  walletBalance: number;
  totalActiveInvestments: number;
  totalProjectedROI: number;
}

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function WalletStats() {
  const [overview, setOverview] = useState<InvestmentSummary>({ walletBalance: 0, totalActiveInvestments: 0, totalProjectedROI: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${base}/api/user/dashboard/overview`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload) => {
        const data = payload?.data ?? {};
        setOverview({
          walletBalance: toNumber(data.walletBalance),
          totalActiveInvestments: toNumber(data.totalActiveInvestments),
          totalProjectedROI: toNumber(data.totalProjectedROI),
        });
      })
      .catch(() => {
        setOverview({
          walletBalance: 0,
          totalActiveInvestments: 0,
          totalProjectedROI: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    ["Total Balance", formatNaira(overview.walletBalance), "Available in your wallet"],
    ["Active Farms", formatNaira(0), `${overview.totalActiveInvestments} active cycle${overview.totalActiveInvestments === 1 ? "" : "s"}`],
    ["Projected Earnings", formatNaira(overview.totalProjectedROI), "From active farms"],
  ];

  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{cards.map(([label, value, detail]) => <div key={label} className="rounded-xl border border-[#d5e7cf] bg-white p-6 shadow-sm"><p className="font-semibold text-gray-500">{label}</p><p className="text-3xl font-bold">{loading ? "—" : value}</p><p className="text-sm text-gray-500">{loading ? "Loading…" : detail}</p></div>)}</div>;
}
