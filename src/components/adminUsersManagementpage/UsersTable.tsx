"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  MdSearch,
  MdDownload,
  MdExpandMore,
  MdMoreVert,
  MdRefresh,
  MdCheckCircle,
  MdBlock,
} from "react-icons/md";

type Status = "Active" | "Pending" | "Suspended";

interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  farmerID?: string;
  profilePhoto?: { url: string; publicId: string };
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  wallet?: {
    balance: number;
    currency: string;
    walletId: string;
  };
}

interface User {
  id: string;
  userID: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  balance: string;
  status: Status;
  joinedDate: string;
  joinedTime: string;
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

function formatWalletBalance(wallet?: ApiUser["wallet"]): string {
  if (!wallet) return "N/A";
  const currency = wallet.currency === "NGN" ? "₦" : "$";
  return `${currency}${wallet.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
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

function mapApiUser(u: ApiUser): User {
  const { date, time } = formatDate(u.createdAt);
  return {
    id: u._id,
    userID: u.farmerID ?? u._id.slice(-8).toUpperCase(),
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    avatar:
      u.profilePhoto?.url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName + " " + u.lastName)}&background=d5e7cf&color=111b0d`,
    isVerified: u.isVerified,
    balance: formatWalletBalance(u.wallet),
    status: normalizeStatus(u.status),
    joinedDate: date,
    joinedTime: time,
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

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
        verified
          ? "bg-blue-50 text-blue-700 border border-blue-100"
          : "bg-amber-50 text-amber-700 border border-amber-100"
      }`}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

// ── Action dropdown ───────────────────────────────────────────────────────────
interface ActionMenuProps {
  userId: string;
  currentStatus: Status;
  onAction: (userId: string, action: "activate" | "suspend") => Promise<void>;
}

function ActionMenu({ userId, currentStatus, onAction }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleAction(action: "activate" | "suspend") {
    setBusy(true);
    setOpen(false);
    await onAction(userId, action);
    setBusy(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="text-[#5e9a4c] hover:text-[#111b0d] transition-colors p-1 rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <MdMoreVert className="text-xl" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-[#d5e7cf] bg-white shadow-lg py-1">
          <button
            onClick={() => handleAction("activate")}
            disabled={currentStatus === "Active"}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdCheckCircle className="text-base shrink-0" />
            Activate User
          </button>
          <button
            onClick={() => handleAction("suspend")}
            disabled={currentStatus === "Suspended"}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <MdBlock className="text-base shrink-0" />
            Suspend User
          </button>
        </div>
      )}
    </div>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────────
function UserCard({
  user,
  onAction,
}: {
  user: User;
  onAction: (userId: string, action: "activate" | "suspend") => Promise<void>;
}) {
  const status = statusBadge[user.status];

  return (
    <div className="flex items-start gap-3 p-4 border-b border-[#eaf3e7] last:border-0 hover:bg-[#f9fcf8] transition-colors">
      <Image
        src={user.avatar}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full object-cover shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d5e7cf&color=111b0d`;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-gray-700 text-sm truncate">
            {user.name}
          </span>
          <ActionMenu
            userId={user.id}
            currentStatus={user.status}
            onAction={onAction}
          />
        </div>
        {/* ── User ID line (NEW) ── */}
        <p className="text-xs font-mono text-[#5e9a4c] mb-0.5">{user.userID}</p>
        <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>
        <div className="flex flex-wrap items-center gap-2">
          <VerifiedBadge verified={user.isVerified} />
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.wrapper}`}
          >
            <span className={`size-1.5 rounded-full ${status.dot}`} />
            {user.status}
          </span>
          <span className="text-xs font-semibold text-[#111b0d]">
            {user.balance}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Joined:{" "}
          <span className="text-[#111b0d]">
            {user.joinedDate} · {user.joinedTime}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-[#eaf3e7] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search / filter state — these drive the API call
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Debounce search input (400 ms) ────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // ── Fetch (params: page + q + status) ────────────────────────────────────
  const fetchUsers = useCallback(
    async (currentPage: number, q: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(currentPage) });
        if (q) params.set("q", q);
        // Backend expects lowercase "active" / "suspended" — skip "All Status" and "Pending"
        if (status === "Active") params.set("status", "active");
        if (status === "Suspended") params.set("status", "suspended");

        const res = await fetch(
          `${BACKEND_URL}/api/admin/dashboard/users?${params.toString()}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");

        setUsers((json.data as ApiUser[]).map(mapApiUser));
        setPage(json.page ?? 1);
        setTotalPages(json.pages ?? 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Re-fetch whenever page, debouncedSearch, or statusFilter changes
  useEffect(() => {
    fetchUsers(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, fetchUsers]);

  // ── Optimistic activate / suspend ─────────────────────────────────────────
  const handleAction = useCallback(
    async (userId: string, action: "activate" | "suspend") => {
      setActionError(null);

      const previousUsers = users;
      const newStatus: Status = action === "activate" ? "Active" : "Suspended";
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
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
        setUsers(previousUsers);
        setActionError(
          err instanceof Error
            ? err.message
            : "Action failed. Please try again.",
        );
      }
    },
    [users],
  );

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-stretch sm:items-center">
        <label className="relative flex items-center w-full sm:max-w-xs group">
          <MdSearch className="absolute left-4 text-xl text-[#5e9a4c] group-focus-within:text-[#46ec13] transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID..."
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
            onClick={() => fetchUsers(page, debouncedSearch, statusFilter)}
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

      {/* ── Error banners ── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button
            onClick={() => fetchUsers(page, debouncedSearch, statusFilter)}
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

      {/* ── Table / Cards ── */}
      <div className="bg-white border border-[#d5e7cf] rounded-xl overflow-hidden shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fcf8] border-b border-[#d5e7cf]">
                {[
                  "User ID",
                  "Profile Photo",
                  "User",
                  "Verified",
                  "Wallet Balance",
                  "Status",
                  "Joined",
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
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-[#5e9a4c] text-sm"
                  >
                    No users match your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const status = statusBadge[user.status];
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#f9fcf8] transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <span className="text-sm font-mono font-medium text-gray-600">
                          {user.userID}
                        </span>
                      </td>
                      <td className="p-4 px-7">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d5e7cf&color=111b0d`;
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-base">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <VerifiedBadge verified={user.isVerified} />
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-[#111b0d]">
                          {user.balance}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.wrapper}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${status.dot}`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#111b0d]">
                          {user.joinedDate}
                        </span>
                        <span className="text-xs text-[#5e9a4c] block">
                          {user.joinedTime}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <ActionMenu
                          userId={user.id}
                          currentStatus={user.status}
                          onAction={handleAction}
                        />
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
                  <div className="size-10 rounded-full bg-[#eaf3e7] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#eaf3e7] rounded w-1/2" />
                    <div className="h-3 bg-[#eaf3e7] rounded w-3/4" />
                  </div>
                </div>
              ))
            : users.map((user) => (
                <UserCard key={user.id} user={user} onAction={handleAction} />
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
