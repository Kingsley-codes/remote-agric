"use client";

import { useEffect, useState } from "react";

interface InvestmentSummary {
  totalActiveInvestments: number;
  totalProjectedROI: number;
}

const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function WalletStats() {
  const [balance, setBalance] = useState(0);
  const [investments, setInvestments] = useState<InvestmentSummary>({ totalActiveInvestments: 0, totalProjectedROI: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    Promise.all([
      fetch(`${base}/api/user/profile`, { credentials: "include" }).then((response) => response.ok ? response.json() : Promise.reject()),
      fetch(`${base}/api/user/dashboard/investments`, { credentials: "include" }).then((response) => response.ok ? response.json() : Promise.reject()),
    ])
      .then(([profile, investmentData]) => {
        setBalance(Number(profile.data?.wallet ?? 0));
        setInvestments(investmentData.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    ["Total Balance", formatNaira(balance), "Available in your wallet"],
    ["Active Farms", formatNaira(0), `${investments.totalActiveInvestments} active cycle${investments.totalActiveInvestments === 1 ? "" : "s"}`],
    ["Projected Earnings", formatNaira(investments.totalProjectedROI), "From active farms"],
  ];

  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{cards.map(([label, value, detail]) => <div key={label} className="rounded-xl border border-[#d5e7cf] bg-white p-6 shadow-sm"><p className="font-semibold text-gray-500">{label}</p><p className="text-3xl font-bold">{loading ? "—" : value}</p><p className="text-sm text-gray-500">{loading ? "Loading…" : detail}</p></div>)}</div>;
}
