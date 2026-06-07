import BottomGrid from "@/components/withdrawalsPage/BottomGrid";
import Header from "@/components/withdrawalsPage/Header";
import SummaryCards from "@/components/withdrawalsPage/SummaryCards";
import WithdrawalsTable from "@/components/withdrawalsPage/WithdrawalsTable";

export default function Page() {
  return (
    <div className="flex">
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Header />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Withdrawal Requests
            </h1>
            <p className="text-slate-500 mt-1 leading-relaxed">
              Securely manage and process user payout requests and fund
              movements.
            </p>
          </div>
          <SummaryCards />
          <WithdrawalsTable />
          <BottomGrid />
        </div>
      </main>
    </div>
  );
}
