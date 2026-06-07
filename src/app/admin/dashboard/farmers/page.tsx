import FarmersTable from "@/components/adminFarmerManagement/FarmersTable";
import Header from "@/components/adminFarmerManagement/Header";
import StatsCards from "@/components/adminFarmerManagement/StatsCards";

export default function Page() {
  return (
    <div className="flex w-full bg-[#f6f8f6] text-[#111b0d]">
      <main className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <StatsCards />
          <FarmersTable />
        </div>
      </main>
    </div>
  );
}
