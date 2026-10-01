"use client";

import { CalendarDays, Gift, Layers3, Sprout, UserRound } from "lucide-react";
import DetailDialog from "@/components/ui/DetailDialog";
import type { ReferralItem } from "./ReferralDashboard";

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(amount);
const date = (value: string) =>
  new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export default function ReferralDetailsModal({ referral, admin, onClose }: {
  referral: ReferralItem;
  admin: boolean;
  onClose: () => void;
}) {
  const person = referral.referredUser;
  const name = [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Deleted user";
  const initials = `${person?.firstName?.[0] ?? ""}${person?.lastName?.[0] ?? ""}`;
  const rewards = referral.rewards ?? [];
  const active = referral.status === "active";

  return (
    <DetailDialog title="Referral details" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start gap-3">
          <div aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#edf6e9] text-lg font-semibold text-primary">
            {initials || <UserRound size={22} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500">Referred user</p>
            <h3 className="mt-0.5 break-words text-lg font-semibold text-slate-800">{name}</h3>
            <p className="mt-1 break-all text-sm text-slate-500">{person?.email || "Email not provided"}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${active ? "border-[#d5e7cf] bg-[#edf6e9] text-primary" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${active ? "bg-primary" : "bg-slate-400"}`} />
            {active ? "Active" : "Expired"}
          </span>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#d5e7cf] bg-[#f4f9f1] p-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-primary"><Gift aria-hidden="true" size={17} />Total earned</dt>
            <dd className="mt-3 break-words text-3xl font-semibold tracking-tight text-slate-800 tabular-nums">{money(referral.commission)}</dd>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-slate-500"><Layers3 aria-hidden="true" size={17} />Rewarded units</dt>
            <dd className="mt-3 text-3xl font-semibold tracking-tight text-slate-800 tabular-nums">{(referral.rewardedUnits ?? 0).toLocaleString("en-NG")}</dd>
          </div>
        </dl>

        <section aria-labelledby="referral-overview-title" className="overflow-hidden rounded-xl border border-[#eaf2e8]">
          <h3 id="referral-overview-title" className="flex items-center gap-2 border-b border-[#eaf2e8] bg-[#f8fbf7] px-4 py-3 text-sm font-semibold text-slate-800">
            <CalendarDays aria-hidden="true" size={16} className="text-primary" />Referral overview
          </h3>
          <dl className="grid gap-x-6 gap-y-4 p-4 text-sm sm:grid-cols-2">
            {[
              ["Farmer ID", person?.farmerID],
              ["Registered", date(referral.createdAt)],
              [active ? "Eligible until" : "Eligibility ended", date(referral.expiresAt)],
              ...(admin ? [
                ["Referrer", [referral.referrer?.firstName, referral.referrer?.lastName].filter(Boolean).join(" ")],
                ["Referrer ID", referral.referrer?.farmerID],
              ] : []),
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 break-words font-medium text-slate-800">{value || "Not provided"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="referral-rewards-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 id="referral-rewards-title" className="text-base font-semibold text-slate-800">Investment rewards</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{rewards.length} {rewards.length === 1 ? "reward" : "rewards"}</span>
          </div>
          {rewards.length ? (
            <ul className="space-y-3">
              {rewards.map(reward => (
                <li key={reward._id} className="overflow-hidden rounded-xl border border-[#eaf2e8]">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf6e9] text-primary"><Sprout size={18} /></span>
                      <div className="min-w-0 flex-1">
                        <h4 className="break-words text-sm font-semibold text-slate-800">{reward.referralRewardInvestment?.title || "Archived investment"}</h4>
                        {reward.referralRewardInvestment?.track?.name && <p className="mt-1 break-words text-xs text-slate-500">{reward.referralRewardInvestment.track.name}</p>}
                        <time dateTime={reward.date} className="mt-1 block text-xs text-slate-500">{date(reward.date)}</time>
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#f8fbf7] p-3 sm:grid-cols-3">
                      <div><dt className="text-xs text-slate-500">Units</dt><dd className="mt-1 text-sm font-semibold text-slate-800 tabular-nums">{reward.units.toLocaleString("en-NG")}</dd></div>
                      <div><dt className="text-xs text-slate-500">Bonus per unit</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800 tabular-nums">{money(reward.referralBonus)}</dd></div>
                      <div className="col-span-2 border-t border-[#eaf2e8] pt-2 sm:col-span-1 sm:border-0 sm:pt-0"><dt className="text-xs text-slate-500">Total bonus</dt><dd className="mt-1 break-words text-sm font-bold text-primary tabular-nums">{money(reward.amount)}</dd></div>
                    </dl>
                  </div>
                  <dl className="space-y-2 border-t border-[#eaf2e8] px-4 py-3 text-xs">
                    {reward.referralRewardInvestment?.orderID && <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-slate-500">Order ID</dt><dd className="break-all font-mono text-slate-600">{reward.referralRewardInvestment.orderID}</dd></div>}
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><dt className="text-slate-500">Transaction ID</dt><dd className="break-all font-mono text-slate-600">{reward.transactionID || "Not provided"}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d5e7cf] bg-[#f8fbf7] px-5 py-8 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#edf6e9] text-primary"><Gift aria-hidden="true" size={21} /></span>
              <p className="mt-3 text-sm font-semibold text-slate-800">No rewards yet</p>
              <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-slate-500">Bonuses from this referral&apos;s eligible investments will appear here.</p>
            </div>
          )}
        </section>
        <div className="flex justify-end border-t border-[#eaf2e8] pt-4">
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">Done</button>
        </div>
      </div>
    </DetailDialog>
  );
}
