"use client";

import { useState } from "react";
import { UserInvestment } from "@/app/dashboard/investments/page";
import InvestmentRow from "./InvestmentRow";
import InvestmentDetailModal from "./Investmentdetailmodal";

function getProduceImage(inv: UserInvestment): string {
  return inv.produce.image1!.url;
}

interface InvestmentTableProps {
  investments: UserInvestment[];
}

export default function InvestmentTable({ investments }: InvestmentTableProps) {
  const [selected, setSelected] = useState<UserInvestment | null>(null);

  return (
    <>
      <div className="w-full rounded-xl border overflow-hidden border-[#d5e7cf] bg-white shadow-sm">
        {/* ── Desktop table ── */}
        <table className="w-full text-left hidden lg:table">
          <thead className="bg-gray-50 border-b border-[#d5e7cf]">
            <tr className="text-xs uppercase text-gray-500">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Invested</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">ROI</th>
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
                farm={`${inv.units} unit${inv.units !== 1 ? "s" : ""} · ${inv.duration} months`}
                invested={`₦${inv.totalPrice.toLocaleString()}`}
                stage={inv.stage}
                status={inv.status}
                roi={`+${inv.ROI}%`}
                onDetails={() => setSelected(inv)}
              />
            ))}
          </tbody>
        </table>

        {/* ── Mobile cards ── */}
        <div className="lg:hidden divide-y divide-[#d5e7cf]">
          {investments.map((inv) => (
            <InvestmentRow
              key={inv._id}
              id={inv._id}
              orderID={inv.orderID}
              image={getProduceImage(inv)}
              name={inv.title}
              farm={`${inv.units} unit${inv.units !== 1 ? "s" : ""} · ${inv.duration} months`}
              invested={`₦${inv.totalPrice.toLocaleString()}`}
              stage={inv.stage}
              status={inv.status}
              roi={`+${inv.ROI}%`}
              mobileCard
              onDetails={() => setSelected(inv)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <InvestmentDetailModal
          investment={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
