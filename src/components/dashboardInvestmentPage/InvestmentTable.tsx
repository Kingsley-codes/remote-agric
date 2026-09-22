"use client";

import { useState } from "react";
import { UserInvestment } from "@/app/dashboard/investments/page";
import InvestmentRow from "./InvestmentRow";
import InvestmentDetailModal from "./Investmentdetailmodal";

function getProduceImage(inv: UserInvestment): string {
  return inv.produce?.image1?.url ?? "";
}

function getProfitAmount(inv: UserInvestment): number {
  return inv.totalPrice * Number(inv.profit) / 100;
}

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

interface InvestmentTableProps {
  investments: UserInvestment[];
  onHarvestChoiceUpdated?: () => void;
}

export default function InvestmentTable({
  investments,
  onHarvestChoiceUpdated,
}: InvestmentTableProps) {
  const [selected, setSelected] = useState<UserInvestment | null>(() =>
    investments.find((investment) => investment.status === "completed" && investment.cashReturnApprovedAt && !investment.rolledOverTo) ?? null,
  );

  return (
    <>
      <div className="w-full rounded-xl border overflow-hidden border-[#d5e7cf] bg-white shadow-sm">
        {/* •”€•”€ Desktop table •”€•”€ */}
        <table className="w-full text-left hidden lg:table">
          <thead className="bg-gray-50 border-b border-[#d5e7cf]">
            <tr className="text-xs uppercase text-gray-500">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Track</th>
              <th className="px-6 py-4">Farm Value</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">profit</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d5e7cf]">
            {investments.map((inv) => (
              <InvestmentRow
                key={inv._id}
                id={inv._id}
                orderID={inv.orderID}
                image={getProduceImage(inv)}
                name={inv.title}
                track={inv.track?.name ?? "Unavailable"}
                farm={`${inv.units} unit${inv.units !== 1 ? "s" : ""} · ${inv.duration} months`}
                invested={`₦${inv.totalPrice.toLocaleString()}`}
                stage={inv.stage}
                status={inv.status}
                profitAmount={formatNaira(getProfitAmount(inv))}
                profitPercentage={`+${inv.profit}%`}
                onDetails={() => setSelected(inv)}
              />
            ))}
          </tbody>
        </table>

        {/* •”€•”€ Mobile cards •”€•”€ */}
        <div className="lg:hidden divide-y divide-[#d5e7cf]">
          {investments.map((inv) => (
            <InvestmentRow
              key={inv._id}
              id={inv._id}
              orderID={inv.orderID}
              image={getProduceImage(inv)}
              name={inv.title}
              track={inv.track?.name ?? "Unavailable"}
              farm={`${inv.units} unit${inv.units !== 1 ? "s" : ""} · ${inv.duration} months`}
              invested={`₦${inv.totalPrice.toLocaleString()}`}
              stage={inv.stage}
              status={inv.status}
              profitAmount={formatNaira(getProfitAmount(inv))}
              profitPercentage={`+${inv.profit}%`}
              mobileCard
              onDetails={() => setSelected(inv)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <InvestmentDetailModal
          investment={selected}
          onUpdated={() => {
            onHarvestChoiceUpdated?.();
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
