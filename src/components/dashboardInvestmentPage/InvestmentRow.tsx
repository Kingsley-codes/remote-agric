type Props = {
  id: string;
  orderID: string;
  image: string;
  name: string;
  farm: string;
  invested: string;
  stage: string;
  status: string;
  roi: string;
  mobileCard?: boolean;
  onDetails: () => void;
};

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StageLabel({ stage }: { stage: string }) {
  const labels: Record<string, string> = {
    "pre-harvest": "Pre-Harvest",
    growing: "Growing",
    harvest: "Harvest",
    completed: "Completed",
  };
  const colors: Record<string, string> = {
    "pre-harvest": "text-amber-700",
    growing: "text-green-700",
    harvest: "text-blue-700",
    completed: "text-gray-500",
  };
  return (
    <span
      className={`text-sm font-semibold ${colors[stage] ?? "text-gray-600"}`}
    >
      {labels[stage] ?? stage}
    </span>
  );
}

export default function InvestmentRow({
  orderID,
  image,
  name,
  farm,
  invested,
  stage,
  status,
  roi,
  mobileCard = false,
  onDetails,
}: Props) {
  // ── Mobile card variant ──
  if (mobileCard) {
    return (
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 size-14 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm leading-snug truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{farm}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-bold">
                  {orderID}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-green-600">
                {roi}
              </span>
            </div>

            {/* Stage */}
            <div className="mt-2">
              <span className="text-xs text-gray-400">Stage: </span>
              <StageLabel stage={stage} />
            </div>

            {/* Footer row */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={status} />
                <span className="text-xs font-semibold text-gray-700">
                  {invested}
                </span>
              </div>
              <button
                onClick={onDetails}
                className="px-3 py-1.5 text-gray-700 text-xs font-bold border border-[#d5e7cf] rounded-lg hover:bg-gray-200 active:bg-gray-100 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop table row variant ──
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-bold text-xs text-gray-500">{orderID}</td>
      <td className="px-6 py-4">
        <div
          className="size-12 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </td>
      <td className="px-6 py-4">
        <p className="font-bold text-gray-700 text-sm">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{farm}</p>
      </td>
      <td className="px-6 py-4 text-gray-700 text-sm font-medium">
        {invested}
      </td>
      <td className="px-6 py-4">
        <StageLabel stage={stage} />
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={status} />
      </td>
      <td className="px-6 py-4 text-green-600 font-bold text-sm">{roi}</td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={onDetails}
          className="px-4 py-2 border border-[#d5e7cf] text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Details
        </button>
      </td>
    </tr>
  );
}
