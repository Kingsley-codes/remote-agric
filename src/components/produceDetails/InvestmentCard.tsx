"use client";

import { useMemo, useState } from "react";
import { FaMinus, FaPlus, FaMoneyBillWave } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface InvestmentCardProps {
  produceId: string;
  unitPrice: number;
  fundedPercent: number;
  soldUnits: number;
  remainingUnits: number;
  minimumUnit: number;
}

export function InvestmentCard({
  produceId,
  unitPrice,
  fundedPercent,
  soldUnits,
  remainingUnits,
  minimumUnit,
}: InvestmentCardProps) {
  const router = useRouter();

  const [units, setUnits] = useState(minimumUnit);

  const total = useMemo(() => units * unitPrice, [units, unitPrice]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Funding Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {fundedPercent}% Funded
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${fundedPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{soldUnits.toLocaleString()} Units Sold</span>
          <span>{remainingUnits.toLocaleString()} Left</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-center py-4 border-y border-gray-200">
        <span className="text-sm font-medium text-gray-500 mb-1">
          Price per Unit
        </span>
        <span className="text-4xl font-extrabold text-gray-900">
          ₦{unitPrice.toLocaleString()}
        </span>
      </div>

      {/* Calculator */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-gray-900">
          How many units? (Min. {minimumUnit})
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUnits((u) => Math.max(minimumUnit, u - 1))}
            className="size-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
          >
            <FaMinus />
          </button>

          <input
            type="number"
            min={minimumUnit}
            max={remainingUnits}
            value={units}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= minimumUnit && value <= remainingUnits) {
                setUnits(value);
              }
            }}
            className="flex-1 h-10 text-center font-bold border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={() => setUnits((u) => Math.min(remainingUnits, u + 1))}
            className="size-10 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-500">
            Total Payable
          </span>
          <span className="text-lg font-bold text-gray-900">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => {
            router.push(`/checkout?produceId=${produceId}&units=${units}`);
          }}
          className="w-full h-12 bg-primary text-gray-100 font-bold rounded-xl text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
        >
          Invest Now <FaMoneyBillWave />
        </button>

        <p className="text-xs text-center text-gray-500">
          By clicking Invest, you agree to the{" "}
          <a
            href="#"
            className="underline text-primary hover:text-primary-dark"
          >
            T&Cs
          </a>
        </p>
      </div>
    </div>
  );
}
