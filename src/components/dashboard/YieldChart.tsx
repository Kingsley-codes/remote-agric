interface YieldInvestment {
  totalPrice: number;
  duration: number;
  ROI?: string | number;
  status: string;
}

interface YieldChartProps {
  projectedRoi: number;
  investments: YieldInvestment[];
}

const months = Array.from({ length: 6 }, (_, index) => {
  const date = new Date();
  date.setMonth(date.getMonth() + index);
  return date.toLocaleDateString("en-NG", { month: "short" });
});

export default function YieldChart({ projectedRoi, investments }: YieldChartProps) {
  const active = investments.filter((investment) => investment.status === "ongoing");
  const values = months.map((_, month) => active.reduce((total, investment) => {
    const roi = (investment.totalPrice * Number(investment.ROI ?? 0)) / 100;
    return total + (month < investment.duration ? roi / investment.duration : 0);
  }, 0));
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${36 + index * 60},${164 - (value / max) * 118}`).join(" ");
  const area = `36,164 ${points} 336,164`;

  return <section className="rounded-2xl border border-[#dce7d8] bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Portfolio outlook</p><h3 className="mt-1 text-xl font-bold text-slate-900">Yield projection</h3><p className="mt-1 text-sm text-slate-500">Estimated returns scheduled over the next six months.</p></div>
      <div className="rounded-xl bg-[#edf6e9] px-4 py-2 text-right"><p className="text-[11px] font-bold uppercase tracking-wide text-primary">Projected return</p><p className="mt-0.5 text-xl font-bold text-[#173d18]">₦{projectedRoi.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</p></div>
    </div>
    <div className="mt-6 overflow-x-auto"><svg viewBox="0 0 372 204" className="h-52 min-w-[372px] w-full" role="img" aria-label="Six month yield projection chart">
      {[46, 85, 124, 164].map((y) => <line key={y} x1="36" x2="336" y1={y} y2={y} stroke="#e5ede2" strokeDasharray="4 5" />)}
      <polygon points={area} fill="#2f7d32" opacity=".10" /><polyline points={points} fill="none" stroke="#2f7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => <g key={months[index]}><circle cx={36 + index * 60} cy={164 - (value / max) * 118} r="4" fill="white" stroke="#2f7d32" strokeWidth="3" /><text x={36 + index * 60} y="191" textAnchor="middle" className="fill-slate-400 text-[11px] font-semibold">{months[index]}</text></g>)}
      <text x="5" y="49" className="fill-slate-400 text-[10px]">High</text><text x="5" y="167" className="fill-slate-400 text-[10px]">₦0</text>
    </svg></div>
    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><span className="inline-block size-2 rounded-full bg-primary" /> Based on {active.length} active farm{active.length === 1 ? "" : "s"} and their stated ROI.</div>
  </section>;
}
