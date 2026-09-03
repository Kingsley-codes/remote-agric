"use client";

import { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";
import TransactionCard from "./TransactionCard";
import TransactionDetailModal from "./TransactionDetailModal";

interface Transaction {
  id: string;
  transactionID: string;
  title: string;
  subtitle: string;
  amount: number;
  direction: "credit" | "debit";
  status: string;
  createdAt: string;
}

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // refetch when page changes
    setLoading(true);
    setError("");
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/transactions?page=${page}&limit=10`,
      { credentials: "include" },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load transaction history");
        return response.json();
      })
      .then((payload) => {
        setTransactions(
          Array.isArray(payload.data?.transactions)
            ? payload.data.transactions
            : [],
        );
        const meta = payload.data?.meta;
        if (meta) setTotalPages(meta.totalPages ?? 1);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Transaction History</h3>

      <div className="overflow-x-auto rounded-xl border border-[#d5e7cf] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-[#d5e7cf] bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">transaction ID</th>
              <th className="p-4">Transaction</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-sm text-gray-500"
                >
                  Loading transactions…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && !transactions.length && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-sm text-gray-500"
                >
                  No transactions yet.
                </td>
              </tr>
            )}
            {transactions.map((transaction) => {
              const date = new Date(transaction.createdAt);
              const positive = transaction.direction === "credit";
              return (
                <TransactionRow
                  key={transaction.id}
                  id={transaction.id}
                  onOpen={(id) => setSelectedId(id)}
                  transactionID={transaction.transactionID}
                  title={transaction.title}
                  subtitle={transaction.subtitle}
                  date={date.toLocaleDateString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  time={date.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  status={transaction.status}
                  amount={`${positive ? "+" : "-"}${formatNaira(toNumber(transaction.amount))}`}
                  positive={positive}
                />
              );
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3 p-2">
          {transactions.map((transaction) => {
            const date = new Date(transaction.createdAt);
            const positive = transaction.direction === "credit";
            return (
              <TransactionCard
                key={transaction.id}
                id={transaction.id}
                transactionID={transaction.transactionID}
                title={transaction.title}
                subtitle={transaction.subtitle}
                date={date.toLocaleDateString("en-NG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                time={date.toLocaleTimeString("en-NG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={transaction.status}
                amount={`${positive ? "+" : "-"}${formatNaira(toNumber(transaction.amount))}`}
                positive={positive}
                onOpen={(id) => setSelectedId(id)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded bg-white border text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <TransactionDetailModal
        transactionId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
