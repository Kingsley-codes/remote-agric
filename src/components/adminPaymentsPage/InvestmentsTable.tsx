"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdSearch,
  MdFilterList,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
  MdDownload,
  MdRefresh,
} from "react-icons/md";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiInvestor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  farmerID?: string;
  profilePhoto?: { url: string; publicId: string };
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface ApiInvestment {
  _id: string;
  orderID: string;
  title: string;
  units: number;
  totalPrice: number;
  orderStatus: string;
  status?: string;
  stage?: string;
  harvestChoice?: "physical-produce" | "cash-return" | null;
  harvestFulfillmentStatus?: string;
  cashReturnAmount?: number;
  duration: number;
  ROI: string;
  orderDate: string;
  investor: ApiInvestor;
}

interface Investment {
  id: string;
  orderID: string;
  investorName: string;
  investorEmail: string;
  investorAvatar: string;
  projectName: string;
  units: number;
  amount: number;
  roi: string;
  duration: number;
  stage: string;
  harvestChoice?: "physical-produce" | "cash-return" | null;
  harvestFulfillmentStatus: string;
  cashReturnAmount?: number;
  orderStatus: string;
  investmentStatus: string;
  orderDate: string;
  orderTime: string;
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function mapApiInvestment(i: ApiInvestment): Investment {
  const { date, time } = formatDate(i.orderDate);
  const inv = i.investor;
  return {
    id: i._id,
    orderID: i.orderID,
    investorName: `${inv.firstName} ${inv.lastName}`,
    investorEmail: inv.email,
    investorAvatar:
      inv.profilePhoto?.url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.firstName + " " + inv.lastName)}&background=d5e7cf&color=111b0d`,
    projectName: i.title,
    units: i.units,
    amount: i.totalPrice,
    roi: i.ROI,
    duration: i.duration,
    stage: i.stage ?? "—",
    harvestChoice: i.harvestChoice,
    harvestFulfillmentStatus: i.harvestFulfillmentStatus ?? "pending-selection",
    cashReturnAmount: i.cashReturnAmount,
    orderStatus: i.orderStatus,
    investmentStatus: i.status ?? "—",
    orderDate: date,
    orderTime: time,
  };
}

// ── Badge components ──────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-green-50 text-green-700 border border-green-100",
    pending: "bg-orange-50 text-orange-700 border border-orange-100",
    cancelled: "bg-red-50 text-red-700 border border-red-100",
    failed: "bg-red-50 text-red-700 border border-red-100",
  };
  const dot: Record<string, string> = {
    confirmed: "bg-green-500",
    pending: "bg-orange-500",
    cancelled: "bg-red-500",
    failed: "bg-red-500",
  };
  const key = status?.toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[key] ?? "bg-slate-100 text-slate-600"}`}
    >
      <span className={`size-1.5 rounded-full ${dot[key] ?? "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    "accepting-investments": "bg-amber-50 text-amber-700 border border-amber-100",
    "land-clearing": "bg-orange-50 text-orange-700 border border-orange-100",
    planting: "bg-lime-50 text-lime-700 border border-lime-100",
    growing: "bg-green-50 text-green-700 border border-green-100",
    harvesting: "bg-blue-50 text-blue-700 border border-blue-100",
  };
  const key = stage?.toLowerCase();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[key] ?? "bg-slate-100 text-slate-600"}`}
    >
      {stage?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HarvestChoiceBadge({ choice }: { choice?: Investment["harvestChoice"] }) {
  if (!choice) {
    return (
      <span className="text-xs font-semibold text-slate-400">
        Not selected
      </span>
    );
  }

  const label =
    choice === "physical-produce" ? "Physical produce" : "Cash return";
  const styles =
    choice === "physical-produce"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
      : "bg-sky-50 text-sky-700 border border-sky-100";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function FulfillmentBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    "pending-selection": "Waiting for user",
    "pending-delivery": "Pending delivery",
    delivered: "Delivered",
    "pending-approval": "Pending approval",
    approved: "Cash credited",
  };
  const styles: Record<string, string> = {
    "pending-selection": "bg-slate-100 text-slate-600",
    "pending-delivery": "bg-amber-50 text-amber-700",
    delivered: "bg-green-50 text-green-700",
    "pending-approval": "bg-orange-50 text-orange-700",
    approved: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="p-4 pl-6">
          <div className="h-4 bg-[#eaf3e7] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────────

function InvestmentCard({
  investment,
  action,
}: {
  investment: Investment;
  action: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-primary/10 last:border-0 hover:bg-[#f9fcf8] transition-colors">
      <Image
        src={investment.investorAvatar}
        alt={investment.investorName}
        width={40}
        height={40}
        className="rounded-full object-cover shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(investment.investorName)}&background=d5e7cf&color=111b0d`;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {investment.investorName}
            </p>
            <p className="text-xs font-mono text-primary mb-0.5">
              {investment.orderID}
            </p>
            <p className="text-xs text-slate-400 truncate mb-2">
              {investment.projectName}
            </p>
          </div>
          <OrderStatusBadge status={investment.orderStatus} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={investment.stage} />
          <HarvestChoiceBadge choice={investment.harvestChoice} />
          <FulfillmentBadge status={investment.harvestFulfillmentStatus} />
          <span className="text-xs font-bold text-slate-900">
            {formatAmount(investment.amount)}
          </span>
          <span className="text-xs text-slate-400">
            ROI {investment.roi}% · {investment.duration}mo
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {investment.orderDate}{" "}
          <span className="text-primary">· {investment.orderTime}</span>
        </p>
        <div className="mt-3">{action}</div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function InvestmentsTable() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const fetchInvestments = useCallback(
    async (currentPage: number, q: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(currentPage) });
        if (q) params.set("q", q);
        if (status !== "All") params.set("status", status.toLowerCase());

        const { data } = await axios.get(
          `${BACKEND_URL}/api/admin/dashboard/investments?${params.toString()}`,
          { withCredentials: true },
        );

        if (!data.success) throw new Error("API returned success: false");

        setInvestments((data.data as ApiInvestment[]).map(mapApiInvestment));
        setPagination(data.pagination ?? { page: 1, pages: 1, total: 0 });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              `Request failed with status ${err.response?.status}`,
          );
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load farm ownerships",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchInvestments(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchInvestments]);

  const runHarvestAction = async (
    investment: Investment,
    action: "mark-delivered" | "approve-cash-return",
  ) => {
    setActionId(investment.id);
    setError(null);

    try {
      const { data } = await axios.patch(
        `${BACKEND_URL}/api/admin/dashboard/investments/${investment.id}/${action}`,
        {},
        { withCredentials: true },
      );

      if (!data.success) throw new Error(data.message ?? "Action failed");
      await fetchInvestments(page, debouncedSearch, statusFilter);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Action failed");
      } else {
        setError(err instanceof Error ? err.message : "Action failed");
      }
    } finally {
      setActionId(null);
    }
  };

  const renderHarvestAction = (investment: Investment) => {
    if (
      investment.harvestChoice === "physical-produce" &&
      investment.harvestFulfillmentStatus === "pending-delivery"
    ) {
      return (
        <button
          onClick={() => runHarvestAction(investment, "mark-delivered")}
          disabled={actionId === investment.id}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {actionId === investment.id ? "Saving..." : "Mark delivered"}
        </button>
      );
    }

    if (
      investment.harvestChoice === "cash-return" &&
      investment.harvestFulfillmentStatus === "pending-approval"
    ) {
      return (
        <button
          onClick={() => runHarvestAction(investment, "approve-cash-return")}
          disabled={actionId === investment.id}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {actionId === investment.id ? "Crediting..." : "Approve cash"}
        </button>
      );
    }

    return <span className="text-xs font-semibold text-slate-400">No action</span>;
  };

  return (
    <div className="mb-6">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-stretch sm:items-center">
        <label className="relative flex items-center w-full sm:max-w-xs group">
          <MdSearch className="absolute left-4 text-xl text-primary group-focus-within:text-primary/70 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search remote farmers or projects..."
            className="w-full h-11 pl-12 pr-4 bg-white border border-primary/20 rounded-xl text-sm text-slate-900 placeholder:text-primary/60 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all"
          />
        </label>

        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 pl-3 pr-9 bg-white border border-primary/20 rounded-lg text-sm font-medium text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="All">Status: All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
            <MdExpandMore className="absolute right-2.5 top-3 text-primary pointer-events-none text-xl" />
          </div>

          <button
            onClick={() =>
              fetchInvestments(page, debouncedSearch, statusFilter)
            }
            className="h-11 px-4 flex items-center gap-2 bg-white border border-primary/20 rounded-lg text-sm font-bold text-slate-900 hover:bg-gray-50 transition-colors shrink-0"
            title="Refresh"
          >
            <MdRefresh className="text-lg" />
          </button>

          <button className="h-11 px-4 flex items-center gap-2 bg-white border border-primary/20 rounded-lg text-sm font-bold text-slate-900 hover:bg-gray-50 transition-colors shrink-0">
            <MdDownload className="text-lg" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button className="h-11 px-4 flex items-center gap-2 bg-white border border-primary/20 rounded-lg text-sm font-bold text-slate-900 hover:bg-gray-50 transition-colors shrink-0 whitespace-nowrap">
            <MdFilterList className="text-lg" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button
            onClick={() =>
              fetchInvestments(page, debouncedSearch, statusFilter)
            }
            className="underline font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white border border-primary/20 rounded-xl overflow-hidden shadow-sm">
        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fcf8] border-b border-primary/20">
                {[
                  "Order ID",
                  "Remote Farmer",
                  "Project",
                  "Units",
                  "Amount",
                  "ROI / Duration",
                  "Stage",
                  "Harvest Choice",
                  "Fulfillment",
                  "Status",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className={`p-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${
                      col === "Status" || col === "Action"
                        ? "text-right pr-6"
                        : "pl-6"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : investments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-12 text-primary text-sm"
                  >
                    No farm ownerships match your search.
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-[#f9fcf8] transition-colors"
                  >
                    {/* Order ID */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="text-xs font-mono font-medium text-primary">
                        {inv.orderID}
                      </span>
                    </td>

                    {/* Investor */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Image
                          src={inv.investorAvatar}
                          alt={inv.investorName}
                          width={36}
                          height={36}
                          className="rounded-full object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.investorName)}&background=d5e7cf&color=111b0d`;
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">
                            {inv.investorName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {inv.investorEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {inv.projectName}
                      </span>
                    </td>

                    {/* Units */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {inv.units.toLocaleString()}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatAmount(inv.amount)}
                      </span>
                    </td>

                    {/* ROI / Duration */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {inv.roi}%
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {inv.duration} months
                      </span>
                    </td>

                    {/* Stage */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <StageBadge stage={inv.stage} />
                    </td>

                    <td className="p-4 pl-6 whitespace-nowrap">
                      <HarvestChoiceBadge choice={inv.harvestChoice} />
                    </td>

                    <td className="p-4 pl-6 whitespace-nowrap">
                      <FulfillmentBadge status={inv.harvestFulfillmentStatus} />
                    </td>

                    {/* Status */}
                    <td className="p-4 pr-6 whitespace-nowrap text-right">
                      <OrderStatusBadge status={inv.orderStatus} />
                    </td>

                    <td className="p-4 pr-6 whitespace-nowrap text-right">
                      {renderHarvestAction(inv)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Card List ── */}
        <div className="md:hidden">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-primary/10 animate-pulse flex gap-3"
                >
                  <div className="size-10 rounded-full bg-[#eaf3e7] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#eaf3e7] rounded w-1/2" />
                    <div className="h-3 bg-[#eaf3e7] rounded w-3/4" />
                  </div>
                </div>
              ))
            : investments.map((inv) => (
                <InvestmentCard
                  key={inv.id}
                  investment={inv}
                  action={renderHarvestAction(inv)}
                />
              ))}
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between p-4 border-t border-primary/20 bg-[#f9fcf8]">
          <p className="text-sm text-primary">
            <span className="font-bold text-slate-900">
              Page {pagination.page}
            </span>
            <span className="hidden sm:inline">
              {" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {pagination.pages}
              </span>{" "}
              <span className="text-slate-400">({pagination.total} total)</span>
            </span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white flex items-center gap-1"
            >
              <MdChevronLeft size={16} />
              Previous
            </button>
            <button
              disabled={page >= pagination.pages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors flex items-center gap-1"
            >
              Next
              <MdChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
