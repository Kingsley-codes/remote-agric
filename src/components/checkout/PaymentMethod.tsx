"use client";

import { FiLock, FiCheckCircle } from "react-icons/fi";
import { FaWallet, FaCreditCard } from "react-icons/fa";

type Method = "card" | "wallet";

type Props = {
  method: Method;
  onMethodChange: (m: Method) => void;
  walletBalance: number | null;
  isAuthenticated: boolean;
};

export default function PaymentMethod({
  method,
  onMethodChange,
  walletBalance,
  isAuthenticated,
}: Props) {
  const box =
    "p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-all h-full flex flex-col items-center justify-center gap-2 bg-background-light cursor-pointer relative";

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            2
          </div>
          <h3 className="text-xl font-bold">Payment Method</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <FiLock />
          SECURE SSL
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 mb-6 ${isAuthenticated ? "sm:grid-cols-2" : ""}`}>
        <button type="button" onClick={() => onMethodChange("card")} className={box}>
          <FaCreditCard size={26} className="text-gray-600" />
          <span className="font-bold text-sm">Credit Card</span>
          {method === "card" && (
            <FiCheckCircle className="absolute top-2 right-2 text-primary" />
          )}
        </button>

        {isAuthenticated && (
          <button type="button" onClick={() => onMethodChange("wallet")} className={box}>
            <FaWallet size={26} className="text-gray-600" />
            <span className="font-bold text-sm">Agro Wallet</span>
            {method === "wallet" && (
              <FiCheckCircle className="absolute top-2 right-2 text-primary" />
            )}
          </button>
        )}
      </div>

      {/* Wallet balance badge — shown whenever balance is available */}
      {walletBalance !== null && method === "wallet" && (
        <div className="flex items-center justify-between bg-primary/10 rounded-lg px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-primary font-medium">
            <FaWallet />
            Agro Wallet Balance
          </div>
          <span className="font-bold text-primary">
            ₦{walletBalance.toLocaleString()}
          </span>
        </div>
      )}
    </section>
  );
}
