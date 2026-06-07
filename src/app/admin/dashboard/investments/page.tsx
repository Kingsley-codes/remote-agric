import InvestmentsTable from "@/components/adminPaymentsPage/InvestmentsTable";
import PageHeader from "@/components/adminPaymentsPage/PageHeader";
import SummaryBar from "@/components/adminPaymentsPage/SummaryBar";

export default function Home() {
  return (
    <main className="flex-1 ml-4 p-8">
      <PageHeader />
      <SummaryBar />
      <InvestmentsTable />
    </main>
  );
}
