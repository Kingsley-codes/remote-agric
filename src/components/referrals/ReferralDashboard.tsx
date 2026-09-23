"use client";

import DetailDialog from "@/components/ui/DetailDialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Gift, Loader2, Users } from "lucide-react";
import { toast } from "react-toastify";

type Person = {
  firstName: string;
  lastName: string;
  email: string;
  farmerID: string;
};

type Reward = {
  _id: string; amount: number; units: number; referralBonus: number; date: string; transactionID: string;
  referralRewardInvestment?: { title: string; orderID: string; totalPrice: number; track?: { name: string } };
};
type Item = {
  rewards?: Reward[];
  _id: string;
  referrer?: Person;
  referredUser: Person;
  status: "active" | "expired";
  commission: number;
  rewardedUnits: number;
  createdAt: string;
  expiresAt: string;
  rewardedAt?: string;
};

type ReferralData = {
  referralCode?: string;
  rewardDurationMonths: number;
  stats: {
    total: number;
    active: number;
    rewarded: number;
    earned?: number;
    paid?: number;
  };
  referrals: Item[];
};

export default function ReferralDashboard({ admin = false }: { admin?: boolean }) {
  const [selected, setSelected] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [data, setData] = useState<ReferralData | null>(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${admin ? "/api/admin/referrals" : "/api/referrals"}`,
        { withCredentials: true },
      )
      .then((response) => setData(response.data.data))
      .catch(() => setError("Unable to load referral activity. Please reload to try again."));
  }, [admin]);

  if (error) return <p role="alert" className="p-10 text-red-700">{error}</p>;
  if (!data) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const money = (amount: number) => `\u20A6${amount.toLocaleString("en-NG")}`;
  const date = (value: string) =>
    new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(value),
    );
  const link =
    !admin && typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${data.referralCode}`
      : "";

  const cards = [
    { label: "Total referrals", value: data.stats.total, Icon: Users },
    { label: "Active referrals", value: data.stats.active, Icon: CheckCircle2 },
    {
      label: admin ? "Rewards paid" : "Total earned",
      value: money(data.stats.paid ?? data.stats.earned ?? 0),
      Icon: Gift,
    },
  ];

  return (
    <section className="p-6 lg:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Grow together</p>
        <h1 className="mt-2 text-3xl font-semibold">
          {admin ? "Referral activity" : "Referral rewards"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Earn a produce-specific bonus per unit for investments made within {data.rewardDurationMonths} months of a referred user’s registration. View each produce for its current rate.
        </p>
      </div>

      {!admin && (
        <div className="mt-7 rounded-2xl bg-primary p-6 text-white">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-green-200">
            Your referral code
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-semibold tracking-wider">
              {data.referralCode}
            </div>
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(link)
                  .then(() => toast.success("Referral link copied"))
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-primary"
            >
              <Copy size={16} />
              Copy referral link
            </button>
          </div>
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <Icon className="text-primary" />
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="p-5 font-medium">Referral history</div>
        {admin && (
          <div className="hidden grid-cols-[1fr_130px_1fr_130px_100px_110px_130px] gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 md:grid">
            <span>Referrer</span>
            <span>Referrer ID</span>
            <span>New user</span>
            <span>New user ID</span>
            <span>Status</span>
            <span>Units</span>
            <span>Rewards</span>
          </div>
        )}
        {data.referrals.length === 0 ? (
          <div className="p-14 text-center text-sm text-gray-500">No referral activity yet.</div>
        ) : (
          data.referrals.map((referral) => (
            <div
              key={referral._id}
              className={`grid gap-3 border-t border-gray-100 p-5 ${
                admin
                  ? "md:grid-cols-[1fr_130px_1fr_130px_100px_110px_130px]"
                  : "md:grid-cols-[1fr_110px_110px_150px]"
              }`}
            >
              <div>
                <p className="text-xs text-gray-400">{admin ? "Referrer" : "Referred user"}</p>
                <p className="font-medium">
                  {admin
                    ? `${referral.referrer?.firstName ?? ""} ${referral.referrer?.lastName ?? ""}`
                    : `${referral.referredUser?.firstName ?? "Deleted"} ${referral.referredUser?.lastName ?? "user"}`}
                </p>
                {!admin && (
                  <p className="mt-1 text-xs text-gray-400">Eligible until {date(referral.expiresAt)}</p>
                )}
              </div>
              {admin && (
                <>
                  <p className="font-mono text-xs font-medium text-primary">
                    {referral.referrer?.farmerID ?? "Unavailable"}
                  </p>
                  <div>
                    <p className="text-xs text-gray-400">New user</p>
                    <p className="font-medium">
                      {referral.referredUser?.firstName ?? "Deleted"} {referral.referredUser?.lastName ?? "user"}
                    </p>
                  </div>
                  <p className="font-mono text-xs font-medium text-primary">
                    {referral.referredUser?.farmerID ?? "Unavailable"}
                  </p>
                </>
              )}
              <span
                className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  referral.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {referral.status}
              </span>
              <p className="font-medium">{referral.rewardedUnits ?? 0} units</p>
              <div><p className="font-medium">{money(referral.commission)}</p><button onClick={() => setSelected(referral)} className="mt-2 text-xs font-semibold text-primary underline">View details</button></div>
            </div>
          ))
        )}
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold">Bonuses by investment</h2>
        <table className="w-full text-left text-sm"><thead><tr className="border-b text-xs text-slate-500">{[...(admin ? ["Referrer"] : []), "Referred user", "Produce / track", "Units", "Bonus per unit", "Total bonus", "Date"].map(label => <th key={label} className="whitespace-nowrap p-3">{label}</th>)}</tr></thead>
          <tbody>{data.referrals.flatMap(referral => (referral.rewards ?? []).map(reward => <tr key={reward._id} className="border-b border-slate-100">
            {admin && <td className="p-3">{referral.referrer?.firstName} {referral.referrer?.lastName}</td>}
            <td className="p-3">{referral.referredUser?.firstName} {referral.referredUser?.lastName}</td>
            <td className="p-3"><button className="text-left font-medium text-primary underline" onClick={() => setSelected(referral)}>{reward.referralRewardInvestment?.title ?? "Archived investment"}</button><p className="text-xs text-slate-500">{reward.referralRewardInvestment?.track?.name ?? "—"}</p></td>
            <td className="p-3">{reward.units}</td><td className="whitespace-nowrap p-3">{money(reward.referralBonus)}</td><td className="whitespace-nowrap p-3 font-semibold">{money(reward.amount)}</td><td className="whitespace-nowrap p-3">{date(reward.date)}</td>
          </tr>))}</tbody></table>
        {!data.referrals.some(r => r.rewards?.length) && <p className="p-6 text-center text-sm text-slate-500">No investment bonuses yet.</p>}
      </div>
      {selected && <DetailDialog title="Referral details" onClose={() => setSelected(null)}>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          {[["Referred user", `${selected.referredUser?.firstName ?? ""} ${selected.referredUser?.lastName ?? ""}`], ["Email", selected.referredUser?.email], ["Farmer ID", selected.referredUser?.farmerID], ["Registered", date(selected.createdAt)], ["Eligible until", date(selected.expiresAt)], ["Total earned", money(selected.commission)], ...(admin ? [["Referrer", `${selected.referrer?.firstName ?? ""} ${selected.referrer?.lastName ?? ""}`], ["Referrer ID", selected.referrer?.farmerID]] : [])].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value || "Not provided"}</dd></div>)}
        </dl>
        <h3 className="mb-3 mt-6 font-semibold">Investment rewards</h3>
        {(selected.rewards ?? []).map(reward => <div key={reward._id} className="mb-3 rounded-xl border p-4 text-sm"><p className="font-semibold">{reward.referralRewardInvestment?.title ?? "Archived investment"}</p><p className="mt-1 text-xs text-slate-500">{reward.referralRewardInvestment?.track?.name} · {reward.referralRewardInvestment?.orderID} · {date(reward.date)}</p><p className="mt-3">{reward.units} units × {money(reward.referralBonus)} = <strong>{money(reward.amount)}</strong></p><p className="mt-2 break-all text-xs text-slate-500">{reward.transactionID}</p></div>)}
        {!selected.rewards?.length && <p className="text-sm text-slate-500">No investment bonuses yet.</p>}
      </DetailDialog>}
    </section>
  );
}
