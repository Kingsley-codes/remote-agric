"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FaPlusCircle,
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaUniversity,
} from "react-icons/fa";

interface Props {
  onClose: () => void;
}

interface Bank {
  id: number;
  name: string;
  code: string;
}

type Step = "form" | "loading" | "success" | "error";

export default function AddAccountModal({ onClose }: Props) {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");

  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [banksError, setBanksError] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const fetchBanks = useCallback(async () => {
    setBanksLoading(true);
    setBanksError(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/get-banks`,
        { credentials: "include" },
      );
      const json = await res.json();
      const list: Bank[] = (json.data ?? json).map((b: Bank) => ({
        id: b.id,
        name: b.name,
        code: b.code,
      }));
      setBanks(list);
    } catch {
      setBanksError(true);
    } finally {
      setBanksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const filteredBanks = banks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()),
  );

  const selectedBank = banks.find((b) => b.code === bankCode);

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(val);
  };

  const isValid =
    accountName.trim() && accountNumber.length === 10 && bankCode && password;

  const handleSubmit = async () => {
    if (!isValid) return;
    setStep("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/add-account`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountName,
            accountNumber,
            bankCode,
            password,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.message ?? "Failed to add account. Please try again.");
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
        onClick={() => {
          setDropdownOpen(false);
          onClose();
        }}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95dvh]">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-[#2d6a27] via-[#4caf50] to-[#a8d5a2] shrink-0" />

        {/* Handle pill (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 px-6 pt-6 pb-8">
          {step === "form" && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-[#eaf2e8] flex items-center justify-center text-[#2d6a27]">
                  <FaPlusCircle size={15} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg leading-tight">
                    Add Withdrawal Account
                  </h2>
                  <p className="text-xs text-gray-400">
                    Link a bank account for payouts
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Account Name */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3.5 border border-[#d5e7cf] rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Account Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="10-digit NUBAN"
                  maxLength={10}
                  className="w-full px-4 py-3.5 border border-[#d5e7cf] rounded-xl text-gray-800 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-sans"
                />
                <p
                  className={`text-xs mt-1 ml-1 ${accountNumber.length === 10 ? "text-[#2d6a27]" : "text-gray-400"}`}
                >
                  {accountNumber.length}/10 digits
                </p>
              </div>

              {/* Bank selector */}
              <div className="mb-4 relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Bank
                </label>
                {banksLoading ? (
                  <div className="w-full px-4 py-3.5 border border-[#d5e7cf] rounded-xl flex items-center gap-2 text-gray-400 text-sm">
                    <FaSpinner className="animate-spin" size={13} />
                    Loading banks…
                  </div>
                ) : banksError ? (
                  <div className="w-full px-4 py-3.5 border border-red-200 rounded-xl flex items-center justify-between text-sm">
                    <span className="text-red-500">Failed to load banks</span>
                    <button
                      onClick={fetchBanks}
                      className="text-[#2d6a27] font-bold text-xs underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((o) => !o)}
                      className="w-full px-4 py-3.5 border border-[#d5e7cf] rounded-xl flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all"
                    >
                      <FaUniversity
                        className="text-gray-300 shrink-0"
                        size={13}
                      />
                      <span
                        className={`flex-1 text-sm ${selectedBank ? "text-gray-800 font-semibold" : "text-gray-300"}`}
                      >
                        {selectedBank ? selectedBank.name : "Select a bank"}
                      </span>
                      <svg
                        className={`size-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#d5e7cf] rounded-xl shadow-xl overflow-hidden">
                        {/* Search */}
                        <div className="px-3 py-2 border-b border-[#eaf2e8]">
                          <input
                            type="text"
                            value={bankSearch}
                            onChange={(e) => setBankSearch(e.target.value)}
                            placeholder="Search banks…"
                            autoFocus
                            className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 focus:outline-none placeholder:text-gray-300"
                          />
                        </div>
                        {/* List */}
                        <div className="overflow-y-auto max-h-48">
                          {filteredBanks.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-400 text-center">
                              No banks found
                            </p>
                          ) : (
                            filteredBanks.map((bank) => (
                              <button
                                key={bank.code}
                                type="button"
                                onClick={() => {
                                  setBankCode(bank.code);
                                  setDropdownOpen(false);
                                  setBankSearch("");
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f6f8f6] transition-colors flex items-center justify-between ${
                                  bankCode === bank.code
                                    ? "bg-[#eaf2e8] text-[#2d6a27] font-semibold"
                                    : "text-gray-700"
                                }`}
                              >
                                {bank.name}
                                {bankCode === bank.code && (
                                  <svg
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Password */}
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
                    placeholder="Confirm with your password"
                    className="w-full pl-9 pr-12 py-3.5 border border-[#d5e7cf] rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a27]/30 focus:border-[#2d6a27] transition-all placeholder:text-gray-300"
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
                  disabled={!isValid}
                  className="flex-1 h-12 bg-[#2d6a27] text-white rounded-xl font-bold text-sm hover:bg-[#245720] active:bg-[#1e4b1b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Add Account
                </button>
              </div>
            </>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-14 gap-4">
              <FaSpinner className="animate-spin text-[#2d6a27]" size={36} />
              <p className="text-gray-500 font-medium">Adding your account…</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="size-16 rounded-full bg-green-50 flex items-center justify-center">
                <FaCheckCircle className="text-[#2d6a27]" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Account Added!
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  <span className="font-semibold text-gray-600">
                    {accountName}
                  </span>{" "}
                  has been linked successfully.
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
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="size-16 rounded-full bg-red-50 flex items-center justify-center">
                <FaTimesCircle className="text-red-500" size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Failed to Add Account
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
