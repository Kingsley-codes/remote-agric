"use client";

import { useState } from "react";
import FarmersTable from "@/components/adminFarmerManagement/FarmersTable";
import Header from "@/components/adminFarmerManagement/Header";
import StatsCards from "@/components/adminFarmerManagement/StatsCards";

export default function Page() {
  const [refreshVersion, setRefreshVersion] = useState(0);
  return (
    <div className="flex w-full bg-[#f6f8f6] text-[#111b0d]">
      <main className="flex-1 flex flex-col">
        <Header onFarmerCreated={() => setRefreshVersion((value) => value + 1)} />

        <div className="flex-1 px-6 pb-8">
          <StatsCards />
          <FarmersTable refreshVersion={refreshVersion} />
        </div>
      </main>
    </div>
  );
}
