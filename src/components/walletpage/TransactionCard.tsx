import React from "react";

type Props = {
  id: string;
  transactionID: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  status: string;
  amount: string;
  positive?: boolean;
  onOpen?: (id: string) => void;
};

export default function TransactionCard({
  id,
  transactionID,
  title,
  subtitle,
  date,
  time,
  status,
  amount,
  positive,
  onOpen,
}: Props) {
  return (
    <div
      onClick={() => onOpen?.(id)}
      className="block md:hidden p-4 bg-white border border-[#e6f0e6] rounded-lg shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">{transactionID}</div>
        <div
          className={`text-sm ${positive ? "text-green-600" : "text-gray-700"}`}
        >
          {amount}
        </div>
      </div>

      <div className="mb-1">
        <div className="font-medium text-gray-800">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
        <div>
          {date} · {time}
        </div>
        <div className="text-gray-600">{status}</div>
      </div>
    </div>
  );
}
