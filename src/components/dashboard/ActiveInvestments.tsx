"use client";

import Link from "next/link";

export interface ActiveInvestment {
  _id: string;
  title: string;
  totalPrice: number;
  duration: number;
  stage?: string;
  produce?: { image1?: { url?: string } };
}

export default function ActiveInvestments({ investments }: { investments: ActiveInvestment[] }) {
  return (
    <div className="bg-card-light rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">Active Farms</h3>
        <Link href="/dashboard/investments" className="text-sm font-bold text-primary">View All</Link>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {investments.length ? investments.map((investment) => <InvestmentItem key={investment._id} title={investment.title} maturity={`${investment.duration} month cycle`} amount={`₦${investment.totalPrice.toLocaleString("en-NG")}`} stage={investment.stage ?? "In progress"} image={investment.produce?.image1?.url} />) : <p className="py-6 text-center text-sm text-gray-500">You do not have any active farms yet.</p>}
      </div>
    </div>
  );
}

interface ItemProps {
  title: string;
  maturity: string;
  amount: string;
  stage: string;
  image?: string;
}

function InvestmentItem({
  title,
  maturity,
  amount,
  stage,
  image,
}: ItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
          style={image ? { backgroundImage: `url(${image})` } : undefined}
        >{!image && <span className="grid h-full place-items-center text-xs text-primary">Farm</span>}</div>

        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-xs text-gray-500">
            Maturity: {maturity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-1 sm:justify-end">
        <div className="flex flex-col items-end min-w-[80px]">
          <span className="text-sm font-bold">{amount}</span>
          <span className="text-xs text-gray-500">Farm Value</span>
        </div>

        <div className="hidden sm:flex flex-col w-32 gap-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="capitalize text-primary">{stage.replaceAll("-", " ")}</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
