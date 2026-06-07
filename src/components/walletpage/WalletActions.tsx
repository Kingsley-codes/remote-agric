"use client";

import { useState } from "react";
import { FaPlusCircle, FaArrowUp } from "react-icons/fa";
import AddAccountModal from "./Addaccountmodal";
import WithdrawFundsModal from "./Withdrawfundsmodal";

export default function WalletActions() {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowAddAccount(true)}
          className="flex-1 min-w-50 h-14 bg-primary text-gray-100 border-[#d5e7cf] font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <FaPlusCircle />
          Add withdrawal Account
        </button>

        <button
          onClick={() => setShowWithdraw(true)}
          className="flex-1 min-w-50 h-14 border rounded-xl border-[#d5e7cf] flex items-center justify-center gap-2 font-bold"
        >
          <FaArrowUp />
          Withdraw Funds
        </button>
      </div>

      {showAddAccount && (
        <AddAccountModal onClose={() => setShowAddAccount(false)} />
      )}

      {showWithdraw && (
        <WithdrawFundsModal onClose={() => setShowWithdraw(false)} />
      )}
    </>
  );
}
