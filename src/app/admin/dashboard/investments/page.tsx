import InvestmentsTable from "@/components/adminPaymentsPage/InvestmentsTable";
import PageHeader from "@/components/adminPaymentsPage/PageHeader";
import SummaryBar from "@/components/adminPaymentsPage/SummaryBar";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 p-4 sm:p-6 lg:p-8">
      <PageHeader />
      <SummaryBar />
      <InvestmentsTable />
    </main>
  );
}
