"use client";

import Breadcrumbs from "@/components/checkout/Breadcrumbs";
import StatusIcon from "@/components/verifyPaymentPage/StatusIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiArrowRight, FiDownload, FiHome, FiRefreshCw } from "react-icons/fi";

type VerifyStatus = "loading" | "success" | "failed" | "pending";

type PaymentDetails = {
  reference: string;
  amount: number;
  produce: string;
  units: number;
  paymentMethod: string;
  date: string;
  transactionId: string;
  produceId: string;
  userEmail: string;
};

// ─── Detail row ─────────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-semibold text-gray-800 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VerifyStatus }) {
  const map = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-600 border-red-200",
    loading: "bg-gray-50 text-gray-500 border-gray-200",
  };

  const label = {
    success: "Payment Successful",
    pending: "Payment Pending",
    failed: "Payment Failed",
    loading: "Checking…",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

export default function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference") ?? "";
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [loading, setLoading] = useState(true); // FIX: now properly toggled
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsAuthenticated(!!storedUser);
  }, []);

  const verify = useCallback(
    async (isRetry = false) => {
      if (isRetry) {
        setRetrying(true);
      } else {
        setStatus("loading");
        setLoading(true); // FIX: show loading screen on initial verify
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/paystack/verify/${reference}`,
          { credentials: "include" },
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Verification failed");

        const payload = data.data;

        setDetails({
          reference: payload.investment?.transactionRef ?? reference,
          amount: payload.amount,
          produce: payload.investment?.title ?? "Investment",
          units: payload.investment?.units ?? 1,
          paymentMethod: payload.paymentMethod ?? "—",
          date: payload.investment?.orderDate
            ? new Date(payload.investment.orderDate).toLocaleString()
            : new Date().toLocaleString(),
          transactionId: payload.paymentID ?? "—",
          produceId: payload.investment?.produce ?? null,
          userEmail: payload.userEmail ?? "—",
        });

        setStatus(
          data.success
            ? "success"
            : payload.investment?.orderStatus === "pending"
              ? "pending"
              : "failed",
        );
      } catch {
        setStatus("failed");
      } finally {
        setRetrying(false);
        setLoading(false); // FIX: always hide loading screen when done
      }
    },
    [reference],
  );

  useEffect(() => {
    if (reference) verify();
  }, [reference, verify]);

  const heading = {
    success: "Payment Confirmed!",
    pending: "Payment Processing",
    failed: "Payment Unsuccessful",
    loading: "",
  }[status];

  const subtext = {
    success:
      "Your investment has been received. You'll get a confirmation email shortly.",
    pending:
      "Your payment is being processed. We'll notify you once it's confirmed.",
    failed:
      "We couldn't process your payment. Please try again or use a different method.",
    loading: "",
  }[status];

  if (loading) {
    return (
      <div className="flex flex-col items-center py-16 gap-6">
        {/* Pulse rings */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex size-24 rounded-full bg-primary/20 animate-ping" />
          <span className="absolute inline-flex size-16 rounded-full bg-primary/30 animate-ping [animation-delay:200ms]" />
          <div className="relative size-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
            <FiRefreshCw size={28} className="text-primary animate-spin" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Verifying Payment</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            Please wait while we confirm your transaction with our payment
            provider. This usually takes a few seconds.
          </p>
        </div>

        {/* Skeleton progress bar */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[loading_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light text-[#111b0d] font-display">
      {/* keyframe for loading bar */}
      <style>{`
        @keyframes loading {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>

      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          produceId={details?.produceId ?? null}
          currentStep="confirmation"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left column: status card ─────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col items-center text-center gap-6 py-6">
                <StatusIcon status={status} />
                <StatusBadge status={status} />

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">{heading}</h2>
                  <p className="text-gray-500 text-sm max-w-sm">{subtext}</p>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  {status === "success" && (
                    <>
                      <button
                        onClick={() =>
                          router.push(
                            isAuthenticated
                              ? "/dashboard"
                              : `/complete-registration?email=${encodeURIComponent(details?.userEmail ?? "")}`,
                          )
                        }
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/20 transition"
                      >
                        {isAuthenticated
                          ? "Go to Dashboard"
                          : "Complete Registration"}{" "}
                        <FiArrowRight />
                      </button>
                      <button className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 font-semibold py-3 px-5 rounded-xl text-sm text-gray-700 transition">
                        <FiDownload size={14} /> Download Receipt
                      </button>
                    </>
                  )}

                  {status === "pending" && (
                    <button
                      onClick={() => verify(true)}
                      disabled={retrying}
                      className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-60"
                    >
                      <FiRefreshCw
                        className={retrying ? "animate-spin" : ""}
                        size={16}
                      />
                      {retrying ? "Checking…" : "Check Again"}
                    </button>
                  )}

                  {status === "failed" && (
                    <>
                      <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/20 transition"
                      >
                        Try Again <FiArrowRight />
                      </button>
                      <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 font-semibold py-3 px-5 rounded-xl text-sm text-gray-700 transition"
                      >
                        <FiHome size={14} /> Go Home
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              {[
                "🔒 SSL Encrypted",
                "✅ SEC Regulated",
                "🏦 Bank-Level Security",
                "📧 Instant Confirmation",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* ── Right column: order summary ──────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            {/* Transaction details card */}
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-linear-to-br from-white to-background-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Transaction Details</h3>
                  {status !== "loading" && <StatusBadge status={status} />}
                </div>
              </div>

              <div className="p-5">
                {details ? (
                  <>
                    <DetailRow
                      label="Reference"
                      value={details.reference}
                      mono
                    />
                    <DetailRow
                      label="Transaction ID"
                      value={details.transactionId}
                      mono
                    />
                    <DetailRow
                      label="Amount Paid"
                      value={`₦${details.amount.toLocaleString()}`}
                    />
                    <DetailRow label="Investment" value={details.produce} />
                    <DetailRow
                      label="Units"
                      value={`${details.units} Unit${details.units !== 1 ? "s" : ""}`}
                    />
                    <DetailRow
                      label="Payment Method"
                      value={
                        details.paymentMethod.charAt(0).toUpperCase() +
                        details.paymentMethod.slice(1)
                      }
                    />
                    <DetailRow label="Date" value={details.date} />
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No transaction data available.
                  </p>
                )}
              </div>
            </div>

            {/* Support nudge */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-sm text-center space-y-1">
              <p className="text-gray-500">Need help with this transaction?</p>
              <a
                href="mailto:support@agrofund.com"
                className="text-primary font-semibold hover:underline"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
