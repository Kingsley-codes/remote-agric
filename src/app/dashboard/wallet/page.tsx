"use client";

import TransactionTable from "@/components/walletpage/TransactionTable";
import WalletActions from "@/components/walletpage/WalletActions";
import WalletHeader from "@/components/walletpage/WalletHeader";
import WalletStats from "@/components/walletpage/WalletStats";
import { useAuth } from "@/hooks/useAuth";

export default function WalletPage() {
  const { loading } = useAuth({ allowedRoles: ["user"] });

  if (loading) {
    return (
      <div className="flex items-center bg-gray-100 justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f6f8f6] p-6 lg:p-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <WalletHeader />

            <WalletStats />

            <WalletActions />

            <TransactionTable />
      </div>
    </div>
  );
}
