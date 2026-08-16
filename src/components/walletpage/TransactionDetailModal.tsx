"use client";

import { useEffect, useState } from "react";

type Props = {
  transactionId: string | null;
  onClose: () => void;
};

export default function TransactionDetailModal({
  transactionId,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!transactionId) return;
    setLoading(true);
    setError("");
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/transactions/${transactionId}`,
      { credentials: "include" },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to fetch transaction details");
        return res.json();
      })
      .then((payload) => setData(payload.data?.transaction ?? null))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [transactionId]);

  if (!transactionId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(720px,95%)] max-h-[90vh] overflow-auto bg-white rounded-lg p-6 shadow-lg">
        <button
          className="absolute right-3 top-3 text-gray-500"
          onClick={onClose}
        >
          Close
        </button>

        <h3 className="text-lg font-semibold mb-4">Transaction details</h3>

        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && data && (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <div className="text-gray-500">Transaction ID</div>
              <div>{data.transactionID}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-gray-500">Type</div>
              <div>{data.transactionType}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-gray-500">Amount</div>
              <div>
                ₦
                {Number(data.amount).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="text-gray-500">Status</div>
              <div>{data.status}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-gray-500">Reference</div>
              <div>{data.transactionRef || data.paymentID || "—"}</div>
            </div>

            <div className="flex justify-between">
              <div className="text-gray-500">Payment method</div>
              <div>{data.paymentMethod || "—"}</div>
            </div>

            {data.produce && (
              <div className="pt-2 border-t border-dashed border-gray-100">
                <div className="text-gray-500">Produce</div>
                <div className="text-sm text-gray-800">
                  {(data.produce as any).produceName ||
                    (data.produce as any).title}
                </div>
              </div>
            )}

            {data.referredUser && (
              <div className="pt-2 border-t border-dashed border-gray-100">
                <div className="text-gray-500">Referred user</div>
                <div className="text-sm text-gray-800">
                  {(data.referredUser as any).firstName}{" "}
                  {(data.referredUser as any).lastName} —{" "}
                  {(data.referredUser as any).email}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-gray-100 text-gray-500 text-xs">
              Created at: {new Date(data.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
