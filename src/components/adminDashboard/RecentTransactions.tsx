"use client";

import { FiArrowRight, FiMoreVertical } from "react-icons/fi";
import TransactionRow from "./TransactionRow";
import { Transaction } from "@/lib";

export default function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: "#TRX-9821",
      investor: "John Doe",
      investorImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYyOUg8r4onY2ycEIrgZsn9M5-IyTMdvLM_8Ixn6JXxuU-S2EUbEEnxL9Mpab0K7PjPl9z4aHIkhVYVwUXXQnlf3zaMq_7ZrtgE5B-U8Zp1IH33vgEmBOdC-bpFjesDvcmriGBdK8cAke6k0mPe8sHZWykAE0Q8s5LXaDH4CCR27n3TCb8ILRvRSZziL-r7S3l89nHrOaM5v8vHBVvO-TzUX0WRibM1-pbfeVVp0QA0rH4Hz8L8gYDNsYZy4cc_72ANcBRByMBHlE",
      type: "Corn (Crop)",
      amount: "$5,000",
      date: "Oct 24, 2023",
      status: "Completed",
      statusColor: "green",
    },
    {
      id: "#TRX-9822",
      investor: "Sarah Smith",
      investorImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlvpB22zCig5HFmXf2wFJ75Ok7NpwZbVTyuSKQOXOD0AVwGCCuXLtKZXS3kFEHqQ2G_f1P4r1mZox4lWv9aA8wsieum_O6Qt8zYYYJc-6YTNS5aqb_ntUeSi9x3lHyp5TwQ9A3b-yHtAq_gcVWvCY5NvbTi8sVio4La5yGe8z_yXxzFHVSKRn4Lvk7XL7QQfG6_5zN5ui0_-iK6rZL-GHbC6Mjb4BMoohvQwpPYu49sTMqolonxUZeskQjFBhh0Vi0XNca1-rpwts",
      type: "Cattle (Livestock)",
      amount: "$12,500",
      date: "Oct 23, 2023",
      status: "Pending",
      statusColor: "yellow",
    },
    {
      id: "#TRX-9823",
      investor: "Michael Brown",
      investorImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDX3q1w2h1ChFWjKOpaXJEIAr5vp_oH3skTD_76b4kn9WuaVUd5ANQGd4BL9z6wm2-D_dbIT2as8NkpvXSjKfadOpXoOPAkv72FGg11A_AwQIbAO0YwL0wMC9vsyL5zhhFZwqHCLbGmYC83yZCS87xa7Hd0W5po__rufuJXzn6hxUdTmaS1VnHESWoFk0MDKSlnSPqPRw22jEAmZsIYGD7mDv0ZgXMmR81TfERJOEqESiecCJCoVsOsmd-QIYKVhnTtdTpf9E07RTc",
      type: "Soybeans (Crop)",
      amount: "$2,100",
      date: "Oct 22, 2023",
      status: "Completed",
      statusColor: "green",
    },
  ];

  const getStatusStyles = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/40",
          text: "text-green-700 dark:text-green-300",
          dot: "bg-green-600 dark:bg-green-400",
        };
      case "Pending":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/40",
          text: "text-yellow-700 dark:text-yellow-300",
          dot: "bg-yellow-600 dark:bg-yellow-400",
        };
      case "Failed":
        return {
          bg: "bg-red-100 dark:bg-red-900/40",
          text: "text-red-700 dark:text-red-300",
          dot: "bg-red-600 dark:bg-red-400",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-700",
          text: "text-slate-700 dark:text-slate-300",
          dot: "bg-slate-600 dark:bg-slate-400",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-6 lg:px-8 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Transactions
        </h3>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
            Filter
          </button>
          <button className="px-4 py-2 rounded-xl text-xs font-bold bg-primary/20 text-green-800 dark:text-green-300">
            Export Report
          </button>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
        {transactions.map((transaction) => {
          const statusStyles = getStatusStyles(transaction.status);
          return (
            <div key={transaction.id} className="p-4 space-y-3">
              {/* Top row: avatar + name + action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full bg-slate-200 dark:bg-slate-600 bg-cover bg-center shrink-0"
                    style={{
                      backgroundImage: `url('${transaction.investorImage}')`,
                    }}
                    aria-label={`Portrait of ${transaction.investor}`}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {transaction.investor}
                    </p>
                    <p className="text-xs text-slate-400">{transaction.id}</p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-primary transition-colors">
                  <FiMoreVertical size={20} />
                </button>
              </div>

              {/* Details row */}
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-0.5">
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {transaction.type}
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {transaction.amount}
                  </p>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="text-slate-400 text-xs">{transaction.date}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyles.bg} ${statusStyles.text}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusStyles.dot}`}
                    />
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Investor</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm font-medium">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-center">
        <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-2">
          View All Transactions
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
