import { useEffect, useState } from "react";
import { UserInvestment } from "@/app/dashboard/investments/page";
import Link from "next/link";

interface Props {
  investment: UserInvestment | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    "accepting-investments": "Open for Ownership",
    "land-clearing": "Land Clearing",
    planting: "Planting",
    growing: "Growing",
    harvesting: "Harvesting",
  };
  return labels[stage] ?? stage;
}

function StageChip({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    "accepting-investments": "bg-amber-50 text-amber-700 border-amber-200",
    "land-clearing": "bg-orange-50 text-orange-700 border-orange-200",
    planting: "bg-lime-50 text-lime-700 border-lime-200",
    growing: "bg-green-50 text-green-700 border-green-200",
    harvesting: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        colors[stage] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {getStageLabel(stage)}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ongoing: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        colors[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#eaf2e8] last:border-0">
      <span className="text-xs text-gray-500 font-medium shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`text-sm font-semibold text-right ${accent ? "text-green-600" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function InvestmentDetailModal({
  investment,
  onClose,
  onUpdated,
}: Props) {
  const [choiceSaving, setChoiceSaving] = useState<
    "physical-produce" | "cash-return" | null
  >(null);
  const [choiceError, setChoiceError] = useState("");

  const chooseHarvestReturn = async (
    choice: "physical-produce" | "cash-return",
  ) => {
    if (!investment) return;

    try {
      setChoiceSaving(choice);
      setChoiceError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/investments/${investment._id}/harvest-choice`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice }),
        },
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Unable to save harvest choice");
      }

      onUpdated?.();
    } catch (error) {
      setChoiceError(
        error instanceof Error ? error.message : "Unable to save harvest choice",
      );
    } finally {
      setChoiceSaving(null);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!investment) return null;

  const image = investment.produce?.image1?.url ?? "";
  const projectedReturn =
    investment.totalPrice * (1 + parseFloat(investment.ROI) / 100);
  const canChooseHarvestReturn =
    investment.stage === "harvesting" &&
    investment.orderStatus === "confirmed" &&
    investment.status === "ongoing" &&
    !investment.harvestChoice;
  const harvestChoiceLabel =
    investment.harvestChoice === "physical-produce"
      ? "Physical produce"
      : investment.harvestChoice === "cash-return"
        ? "Cash return"
        : "Not selected";
  const fulfillmentLabels: Record<string, string> = {
    "pending-selection": "Waiting for your selection",
    "pending-delivery": "Waiting for delivery",
    delivered: "Delivered",
    "pending-approval": "Waiting for admin approval",
    approved: "Cash credited",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, centered card on sm+ */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] overflow-hidden">
        {/* Hero image strip */}
        {image && (
          <div
            className="h-36 sm:h-44 w-full bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="h-full w-full bg-linear-to-t from-black/60 to-transparent flex items-end p-4">
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-snug">
                  {investment.title}
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {investment.orderID}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* If no image, show header bar */}
        {!image && (
          <div className="flex items-start justify-between gap-2 p-5 border-b border-[#eaf2e8] shrink-0">
            <div>
              <p className="font-bold text-gray-800 text-base">
                {investment.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {investment.orderID}
              </p>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {/* Status chips */}
          <div className="flex items-center gap-2 mb-4">
            <StatusChip status={investment.status} />
            <StageChip stage={investment.stage} />
            <span className="ml-auto text-xs text-gray-400">
              {investment.orderStatus}
            </span>
          </div>

          {/* Detail rows */}
          <div className="bg-[#f6f8f6] rounded-xl px-4 py-1 mb-4">
            <DetailRow label="Order ID" value={investment.orderID} />
            <DetailRow
              label="Units"
              value={`${investment.units} unit${investment.units !== 1 ? "s" : ""}`}
            />
            <DetailRow
              label="Duration"
              value={`${investment.duration} months`}
            />
            <DetailRow
              label="Farm Value"
              value={`₦${investment.totalPrice.toLocaleString()}`}
            />
            <DetailRow label="ROI" value={`+${investment.ROI}%`} accent />
            <DetailRow
              label="Projected Return"
              value={`₦${Math.round(projectedReturn).toLocaleString()}`}
              accent
            />
            <DetailRow label="Harvest Choice" value={harvestChoiceLabel} />
            <DetailRow
              label="Fulfillment"
              value={
                fulfillmentLabels[
                  investment.harvestFulfillmentStatus ?? "pending-selection"
                ] ?? "Waiting for your selection"
              }
            />
          </div>

          {canChooseHarvestReturn && (
            <div className="bg-white border border-[#d5e7cf] rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-gray-800">
                Choose your harvest return
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Pick physical produce for delivery, or cash return for admin
                approval and wallet credit.
              </p>
              {choiceError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {choiceError}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => chooseHarvestReturn("physical-produce")}
                  disabled={Boolean(choiceSaving)}
                  className="rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary hover:bg-green-50 disabled:opacity-60"
                >
                  {choiceSaving === "physical-produce"
                    ? "Saving..."
                    : "Physical produce"}
                </button>
                <button
                  onClick={() => chooseHarvestReturn("cash-return")}
                  disabled={Boolean(choiceSaving)}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {choiceSaving === "cash-return"
                    ? "Saving..."
                    : "Cash return"}
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#f6f8f6] rounded-xl px-4 py-1 mb-4">
            <DetailRow
              label="Order Date"
              value={new Date(investment.orderDate).toLocaleDateString(
                "en-NG",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            />
            <DetailRow label="Email" value={investment.customerEmail} />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-[#eaf2e8] bg-white">
          <Link href={`/community?room=${investment.produce?._id}`} onClick={onClose} className="mb-2 block w-full rounded-xl border border-primary py-3 text-center text-sm font-bold text-primary hover:bg-green-50">Open produce community</Link>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark active:bg-[#1e4b1b] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
