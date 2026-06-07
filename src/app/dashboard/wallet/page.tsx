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
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f8f6]">
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <WalletHeader />

            <WalletStats />

            <WalletActions />

            <TransactionTable />
          </div>
        </div>
      </main>
    </div>
  );
}
