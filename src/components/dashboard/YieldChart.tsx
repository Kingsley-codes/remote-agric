interface YieldInvestment {
  _id: string;
  title: string;
  totalPrice: number;
  duration: number;
  ROI?: string | number;
  orderDate?: string;
  status: string;
}

interface YieldChartProps { projectedRoi: number; investments: YieldInvestment[] }

const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export default function YieldChart({ projectedRoi, investments }: YieldChartProps) {
  const active = investments.filter((investment) => investment.status === "ongoing");
  const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
  const months = Array.from({ length: 6 }, (_, index) => { const date = new Date(start); date.setMonth(start.getMonth() + index); return date; });
  const maturity = (investment: YieldInvestment) => { const date = new Date(investment.orderDate ?? Date.now()); date.setMonth(date.getMonth() + investment.duration); return date; };
  const returns = active.map((investment) => ({ ...investment, date: maturity(investment), expected: investment.totalPrice * Number(investment.ROI ?? 0) / 100 }));
  const values = months.map((month) => returns.filter((item) => item.date.getFullYear() === month.getFullYear() && item.date.getMonth() === month.getMonth()).reduce((sum, item) => sum + item.expected, 0));
  const max = Math.max(...values, 1);
  const bars = values.map((value, index) => ({ x: 46 + index * 67, height: Math.max(value ? 10 : 2, value / max * 142), value }));
  const upcoming = returns.filter((item) => item.date >= start).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  const averageRoi = active.length ? active.reduce((sum, item) => sum + Number(item.ROI ?? 0), 0) / active.length : 0;

  return <section className="grid overflow-hidden rounded-2xl border border-[#dce7d8] bg-white shadow-sm xl:grid-cols-[minmax(0,1fr)_300px]">
    <div className="p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Return schedule</p><h3 className="mt-1 text-xl font-bold text-slate-900">Expected yield returns</h3><p className="mt-1 text-sm text-slate-500">Projected payout value by each farm’s expected maturity month.</p></div><div className="rounded-xl bg-[#edf6e9] px-4 py-2"><p className="text-[11px] font-bold uppercase tracking-wide text-primary">Total expected</p><p className="text-xl font-bold text-[#173d18]">{formatNaira(projectedRoi)}</p></div></div>
      <div className="mt-7 overflow-x-auto"><svg viewBox="0 0 470 260" className="h-64 min-w-[470px] w-full" role="img" aria-label="Expected yield returns by month">
        {[42, 89, 136, 183].map((y) => <line key={y} x1="42" x2="445" y1={y} y2={y} stroke="#e7eee5" strokeDasharray="4 6" />)}
        {bars.map((bar, index) => <g key={months[index].toISOString()}><rect x={bar.x} y={200 - bar.height} width="36" height={bar.height} rx="7" fill={bar.value ? "#2f7d32" : "#dfe9dc"} /><text x={bar.x + 18} y="226" textAnchor="middle" className="fill-slate-500 text-[11px] font-semibold">{months[index].toLocaleDateString("en-NG", { month: "short" })}</text>{bar.value > 0 && <text x={bar.x + 18} y={190 - bar.height} textAnchor="middle" className="fill-primary text-[10px] font-bold">{formatNaira(bar.value)}</text>}</g>)}
        <text x="5" y="45" className="fill-slate-400 text-[10px]">Higher</text><text x="8" y="204" className="fill-slate-400 text-[10px]">₦0</text>
      </svg></div><p className="mt-2 text-xs text-slate-500">Bars represent expected ROI only, not the original farm ownership value.</p>
    </div>
    <aside className="border-t border-[#e5ede2] bg-[#f8fbf7] p-5 sm:p-7 xl:border-l xl:border-t-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Portfolio insights</p><div className="mt-5 space-y-4"><Insight label="Next expected return" value={upcoming ? formatNaira(upcoming.expected) : "—"} detail={upcoming ? `${upcoming.title} · ${upcoming.date.toLocaleDateString("en-NG", { month: "short", year: "numeric" })}` : "No future returns scheduled"} /><Insight label="Average projected ROI" value={`${averageRoi.toFixed(1)}%`} detail={`Across ${active.length} active farm${active.length === 1 ? "" : "s"}`} /><Insight label="Scheduled return months" value={String(values.filter(Boolean).length)} detail="Within the next six months" /></div></aside>
  </section>;
}

function Insight({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-xl border border-[#e0eadc] bg-white p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>; }
