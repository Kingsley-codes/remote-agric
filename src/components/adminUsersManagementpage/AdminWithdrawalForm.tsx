"use client";
import { useRef, useState } from "react";
type Wallet = { balance: number; currency: string; walletId: string };
type Intent = { amount: number; reason: string; idempotencyKey: string };
export default function AdminWithdrawalForm({
  userId,
  wallet,
  onUpdate,
}: {
  userId: string;
  wallet?: Wallet;
  onUpdate: (wallet: Wallet) => void;
}) {
  const storageKey = `admin-withdrawal:${userId}`;
  const [intent, setIntent] = useState<Intent | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  });
  const [open, setOpen] = useState(Boolean(intent));
  const [amount, setAmount] = useState(intent ? String(intent.amount) : "");
  const [reason, setReason] = useState(intent?.reason || "");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function withdraw(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const value = Number(amount);
    if (
      !intent &&
      (!wallet ||
        !Number.isFinite(value) ||
        value <= 0 ||
        value > wallet.balance ||
        !/^\d+(\.\d{1,2})?$/.test(amount) ||
        !reason.trim())
    ) {
      setError(
        "Enter a positive amount within the available balance and a reason.",
      );
      return;
    }
    pending.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const request = intent || {
        amount: value,
        reason: reason.trim(),
        idempotencyKey: crypto.randomUUID(),
      };
      sessionStorage.setItem(storageKey, JSON.stringify(request));
      setIntent(request);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/admin/dashboard/users/${userId}/withdraw`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        },
      );
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        if (response.status === 400 || response.status === 404) {
          sessionStorage.removeItem(storageKey);
          setIntent(null);
        }
        throw new Error(
          payload.message ||
            "Unable to record withdrawal. Retry the same request.",
        );
      }
      if (payload.data.wallet) onUpdate(payload.data.wallet);
      setMessage(payload.message);
      if (payload.data.withdrawal.withdrawalEmailStatus === "sent") {
        sessionStorage.removeItem(storageKey);
        setIntent(null);
        setAmount("");
        setReason("");
        setOpen(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to record withdrawal. Retry the same request.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Available wallet balance</p>
          <p className="mt-1 text-xl font-semibold">
            {wallet
              ? new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: wallet.currency || "NGN",
                }).format(wallet.balance)
              : "Wallet unavailable"}
          </p>
        </div>
        {!open && (
          <button
            type="button"
            disabled={!wallet || wallet.balance <= 0}
            onClick={() => setOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Withdraw balance
          </button>
        )}
      </div>
      {open && (
        <form onSubmit={withdraw} className="mt-4 space-y-4" aria-busy={busy}>
          <p className="text-sm text-slate-600">
            This deducts from the user&apos;s wallet and records a completed
            withdrawal. No money is sent to a bank. The user receives an email
            identifying this as an admin action.
          </p>
          <label className="block text-sm font-medium">
            Amount (NGN)
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              max={intent ? undefined : wallet?.balance}
              value={amount}
              disabled={busy || Boolean(intent)}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-60"
            />
          </label>
          <label className="block text-sm font-medium">
            Reason (included in the email)
            <textarea
              required
              maxLength={500}
              value={reason}
              disabled={busy || Boolean(intent)}
              onChange={(event) => setReason(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-60"
            />
          </label>
          <div className="flex justify-end gap-3">
            {!intent && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy
                ? "Processing…"
                : intent
                  ? "Retry existing withdrawal"
                  : "Confirm withdrawal"}
            </button>
          </div>
        </form>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-3 text-sm text-slate-700">
          {message}
        </p>
      )}
    </section>
  );
}
