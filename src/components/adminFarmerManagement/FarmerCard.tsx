import Image from "next/image";
import { FormattedFarmer, getFundingStatusBadge } from "./FarmersTable";
import ActionMenu from "./ActionMenu";

type Status = "Active" | "Pending" | "Suspended";

// ── Badge helpers ─────────────────────────────────────────────────────────────
const statusBadge: Record<Status, { wrapper: string; dot: string }> = {
  Active: {
    wrapper: "bg-green-50 text-green-700 border border-green-100",
    dot: "bg-green-500",
  },
  Pending: {
    wrapper: "bg-orange-50 text-orange-700 border border-orange-100",
    dot: "bg-orange-500",
  },
  Suspended: {
    wrapper: "bg-red-50 text-red-700 border border-red-100",
    dot: "bg-red-500",
  },
};

// ── Mobile card ───────────────────────────────────────────────────────────────
export default function FarmerCard({
  farmer,
  onAction,
  onClick,
}: {
  farmer: FormattedFarmer;
  onAction: (userId: string, action: "activate" | "suspend") => Promise<void>;
  onClick: () => void;
}) {
  const status = statusBadge[farmer.status];
  const fundingStatusBadge = getFundingStatusBadge(farmer.fundingStatus);

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-4 border-b border-[#eaf3e7] last:border-0 hover:bg-[#f9fcf8] transition-colors cursor-pointer"
    >
      <Image
        src={farmer.avatar}
        alt={farmer.name}
        width={48}
        height={48}
        className="rounded-full object-cover shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=d5e7cf&color=111b0d`;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-gray-800 text-sm truncate">
            {farmer.name}
          </span>
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              userId={farmer.id}
              currentStatus={farmer.status}
              onAction={onAction}
            />
          </div>
        </div>
        <p className="text-xs font-mono text-[#5e9a4c] mb-1">
          {farmer.farmerID}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.wrapper}`}
          >
            <span className={`size-1.5 rounded-full ${status.dot}`} />
            {farmer.status}
          </span>
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${fundingStatusBadge.className}`}
          >
            {fundingStatusBadge.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-[#2d4a1e] mt-2">
          {farmer.fundingAmount}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Joined: {farmer.joinedDate}
        </p>
      </div>
    </div>
  );
}
