import { InvestmentStatus } from "@/lib/investment";

interface StatusBadgeProps {
  status: InvestmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-tighter">
        <span className="h-1.5 w-1.5 bg-primary rounded-full" />
        Active
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-tighter">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-tighter">
      Pending
    </span>
  );
}
