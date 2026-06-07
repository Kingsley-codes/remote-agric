"use client";

import { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Props {
  onClose: () => void;
}

type Step = "form" | "loading" | "success" | "error";

export default function WithdrawFundsModal({ onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const formatted = amount
    ? `₦${Number(amount.replace(/,/g, "")).toLocaleString("en-NG")}`
    : "";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw);
  };

  const handleSubmit = async () => {
    if (!amount || !password) return;
    setStep("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/withdraw`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount), password }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.message ?? "Withdrawal failed. Please try again.");
        setStep("error");
      } else {
        setStep("success");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-[#2d6a27] via-[#4caf50] to-[#a8d5a2]" />

        {/* Handle pill (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-8">
          {step === "form" && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-[#eaf2e8] flex items-center justify-center text-[#2d6a27]">
                  <FaArrowUp size={15} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg leading-tight">
                    Withdraw Funds
                  </h2>
                  <p className="text-xs text-gray-400">
                    Transfer to your linked account
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Amount input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    ₦
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount ? Number(amount).toLocaleString("en-NG") : ""}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-3.5 border border-[#d5e7cf] rounded-xl text-gray-800 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all placeholder:text-gray-300"
                  />
                </div>
                {formatted && (
                  <p className="text-xs text-[#2d6a27] font-semibold mt-1 ml-1">
                    {formatted}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={13}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-12 py-3.5 border border-[#d5e7cf] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all placeholder:text-gray-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold hover:text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-12 border border-[#d5e7cf] rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!amount || !password}
                  className="flex-1 h-12 bg-[#2d6a27] text-white rounded-xl font-bold text-sm hover:bg-[#245720] active:bg-[#1e4b1b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <FaSpinner className="animate-spin text-[#2d6a27]" size={36} />
              <p className="text-gray-500 font-medium">
                Processing withdrawal…
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="size-16 rounded-full bg-green-50 flex items-center justify-center">
                <FaCheckCircle className="text-[#2d6a27]" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Withdrawal Initiated
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Your withdrawal of {formatted} is being processed.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 w-full h-12 bg-[#2d6a27] text-white rounded-xl font-bold text-sm hover:bg-[#245720] transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="size-16 rounded-full bg-red-50 flex items-center justify-center">
                <FaTimesCircle className="text-red-500" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Withdrawal Failed
                </h3>
                <p className="text-sm text-gray-400 mt-1">{errorMsg}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 h-12 border border-[#d5e7cf] rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setStep("form");
                    setErrorMsg("");
                  }}
                  className="flex-1 h-12 bg-[#2d6a27] text-white rounded-xl font-bold text-sm hover:bg-[#245720] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
