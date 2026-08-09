"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { MdSearch, MdDownload, MdExpandMore, MdRefresh } from "react-icons/md";
import ActionMenu from "./ActionMenu";
import FarmerDetailModal from "./FarmerDetailModal";
import FarmerCard from "./FarmerCard";

type Status = "Active" | "Pending" | "Suspended";

interface Farmer {
  _id: string;
  name: string;
  town: string;
  lga: string;
  farmerID?: string;
  status: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  farmSize: string;
  fundingAmount: string;
  cropsGrown: string[];
  fundingStatus: string;
  expextedYield: string;
  email?: string;
  phone?: string;
}

export interface FormattedFarmer {
  id: string;
  farmerID: string;
  name: string;
  town: string;
  lga: string;
  state: string;
  avatar: string;
  farmSize: string;
  fundingAmount: string;
  cropsGrown: string[];
  status: Status;
  fundingStatus: string;
  joinedDate: string;
  joinedTime: string;
  expextedYield: string;
  email?: string;
  phone?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// ── Helpers ──────────────────────────────────────────────────────────────────
function normalizeStatus(raw: string): Status {
  const map: Record<string, Status> = {
    active: "Active",
    pending: "Pending",
    suspended: "Suspended",
    deactivated: "Suspended",
    inactive: "Suspended",
  };
  return map[raw?.toLowerCase()] ?? "Pending";
}

function formatWalletBalance(fundingAmount?: string): string {
  if (!fundingAmount) return "N/A";
  const amount =
    typeof fundingAmount === "string"
      ? parseFloat(fundingAmount)
      : fundingAmount;
  return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

function formatFarmer(f: Farmer): FormattedFarmer {
  const { date, time } = formatDate(f.createdAt);
  return {
    id: f._id,
    farmerID: f.farmerID ?? f._id.slice(-8).toUpperCase(),
    name: f.name,
    town: f.town,
    lga: f.lga,
    state: f.state,
    email: f.email,
    phone: f.phone,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=d5e7cf&color=111b0d&size=128`,
    farmSize: f.farmSize,
    fundingAmount: formatWalletBalance(f.fundingAmount),
    status: normalizeStatus(f.status),
    joinedDate: date,
    joinedTime: time,
    cropsGrown: f.cropsGrown,
    fundingStatus: f.fundingStatus,
    expextedYield: f.expextedYield,
  };
}

// ── Badge helpers ─────────────────────────────────────────────────────────────
const statusBadge: Record<Status, { wrapper: string; dot: string }> = {
  Active: {
    wrapper: "bg-green-50 text-green-700 border border-green-100",
    dot: "bg-green-500",
  },
  Pending: {
    wrapper: "bg-orange-50 text-orange-700 border border-orange-100",
    dot: "bg-orange-500",
  },
  Suspended: {
    wrapper: "bg-red-50 text-red-700 border border-red-100",
    dot: "bg-red-500",
  },
};

export function getFundingStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    partial: {
      label: "Partially Funded",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    "partially funded": {
      label: "Partially Funded",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    funded: {
      label: "Fully Funded",
      className: "bg-green-50 text-green-700 border-green-100",
    },
    "fully funded": {
      label: "Fully Funded",
      className: "bg-green-50 text-green-700 border-green-100",
    },
  };

  const normalizedStatus = status?.toLowerCase() || "pending";
  return (
    statusMap[normalizedStatus] || {
      label: "Unknown",
      className: "bg-gray-50 text-gray-700 border-gray-100",
    }
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-[#eaf3e7] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function FarmersTable() {
  const [farmers, setFarmers] = useState<FormattedFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FormattedFarmer | null>(
    null,
  );

  // Search / filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Fetch farmers
  const fetchFarmers = useCallback(
    async (currentPage: number, q: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(currentPage) });
        if (q) params.set("q", q);
        if (status === "Active") params.set("status", "active");
        if (status === "Suspended") params.set("status", "suspended");

        const res = await fetch(
          `${BACKEND_URL}/api/admin/dashboard/farmers?${params.toString()}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");

        // FIX: Check both possible response structures
        const farmersData = json.data || json.farmers || [];

        setFarmers(farmersData.map(formatFarmer));
        setPage(json.page ?? currentPage ?? 1);
        setTotalPages(json.pages ?? 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load producers");
        // Clear farmers on error to avoid showing stale data
        setFarmers([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Re-fetch on changes
  useEffect(() => {
    fetchFarmers(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchFarmers]);

  // Activate / suspend
  const handleAction = useCallback(
    async (userId: string, action: "activate" | "suspend") => {
      setActionError(null);

      const previousFarmers = farmers;
      const newStatus: Status = action === "activate" ? "Active" : "Suspended";
      setFarmers((prev) =>
        prev.map((f) => (f.id === userId ? { ...f, status: newStatus } : f)),
      );

      try {
        const endpoint =
          action === "activate"
            ? `${BACKEND_URL}/api/admin/dashboard/users/activate`
            : `${BACKEND_URL}/api/admin/dashboard/users/suspend`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId }),
        });

        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message ?? "Action failed");
      } catch (err) {
        setFarmers(previousFarmers);
        setActionError(
          err instanceof Error
            ? err.message
            : "Action failed. Please try again.",
        );
      }
    },
    [farmers],
  );

  return (
    <div>
      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <FarmerDetailModal
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          onUpdate={() => fetchFarmers(page, debouncedSearch, statusFilter)} // Add this line
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-stretch sm:items-center">
        <label className="relative flex items-center w-full sm:max-w-xs group">
          <MdSearch className="absolute left-4 text-xl text-[#5e9a4c] group-focus-within:text-[#46ec13] transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or producer ID..."
            className="w-full h-11 pl-12 pr-4 bg-white border border-[#d5e7cf] rounded-xl text-sm text-[#111b0d] placeholder:text-[#5e9a4c] focus:ring-2 focus:ring-[#46ec13]/50 focus:border-[#46ec13] focus:outline-none transition-all"
          />
        </label>

        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 pl-3 pr-9 bg-white border border-[#d5e7cf] rounded-lg text-sm font-medium text-[#111b0d] focus:ring-1 focus:ring-[#46ec13] focus:border-[#46ec13] appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
            <MdExpandMore className="absolute right-2.5 top-3 text-[#5e9a4c] pointer-events-none text-xl" />
          </div>

          <button
            onClick={() => fetchFarmers(page, debouncedSearch, statusFilter)}
            className="h-11 px-4 flex items-center gap-2 bg-white border border-[#d5e7cf] rounded-lg text-sm font-bold text-[#111b0d] hover:bg-gray-50 transition-colors shrink-0"
            title="Refresh"
          >
            <MdRefresh className="text-lg" />
          </button>

          <button className="h-11 px-4 flex items-center gap-2 bg-white border border-[#d5e7cf] rounded-lg text-sm font-bold text-[#111b0d] hover:bg-gray-50 transition-colors shrink-0">
            <MdDownload className="text-lg" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Error banners */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button
            onClick={() => fetchFarmers(page, debouncedSearch, statusFilter)}
            className="underline font-semibold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>⚠ {actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="underline font-semibold hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table / Cards */}
      <div className="bg-white border border-[#d5e7cf] rounded-xl overflow-hidden shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fcf8] border-b border-[#d5e7cf]">
                {[
                  "Producer ID",
                  "Producer",
                  "Location",
                  "Farm Size",
                  "Crops",
                  "Funding",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`p-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${
                      col === "Actions" ? "text-right pr-6" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaf3e7]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : farmers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-[#5e9a4c] text-sm"
                  >
                    No producers match your search.
                  </td>
                </tr>
              ) : (
                farmers.map((farmer) => {
                  const status = statusBadge[farmer.status];
                  const fundingStatusBadge = getFundingStatusBadge(
                    farmer.fundingStatus,
                  );
                  return (
                    <tr
                      key={farmer.id}
                      onClick={() => setSelectedFarmer(farmer)}
                      className="hover:bg-[#f9fcf8] transition-colors cursor-pointer"
                    >
                      <td className="p-4 pl-6">
                        <span className="text-sm font-mono font-medium text-gray-600">
                          {farmer.farmerID}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={farmer.avatar}
                            alt={farmer.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm">
                              {farmer.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">
                            {farmer.town}
                          </span>
                          <span className="text-xs text-gray-400">
                            {farmer.lga}, {farmer.state}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-700">
                          {farmer.farmSize}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {farmer.cropsGrown.slice(0, 2).map((crop, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {crop}
                            </span>
                          ))}
                          {farmer.cropsGrown.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{farmer.cropsGrown.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#2d4a1e]">
                            {farmer.fundingAmount}
                          </span>
                          <span
                            className={`inline-flex text-xs font-medium mt-1 ${fundingStatusBadge.className} px-2 py-0.5 rounded-full w-fit`}
                          >
                            {fundingStatusBadge.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.wrapper}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${status.dot}`}
                          />
                          {farmer.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div onClick={(e) => e.stopPropagation()}>
                          <ActionMenu
                            userId={farmer.id}
                            currentStatus={farmer.status}
                            onAction={handleAction}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-[#eaf3e7] animate-pulse flex gap-3"
                >
                  <div className="size-12 rounded-full bg-[#eaf3e7] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#eaf3e7] rounded w-1/2" />
                    <div className="h-3 bg-[#eaf3e7] rounded w-3/4" />
                  </div>
                </div>
              ))
            : farmers.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  onAction={handleAction}
                  onClick={() => setSelectedFarmer(farmer)}
                />
              ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#d5e7cf] bg-[#f9fcf8]">
          <p className="text-sm text-[#5e9a4c]">
            <span className="font-bold text-[#111b0d]">Page {page}</span>
            <span className="hidden sm:inline">
              {" "}
              of <span className="font-bold text-[#111b0d]">{totalPages}</span>
            </span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-[#d5e7cf] text-sm font-medium text-[#5e9a4c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-[#d5e7cf] text-sm font-medium text-[#5e9a4c] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-[#46ec13] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
