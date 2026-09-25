"use client";

import AdminWithdrawalForm from "./AdminWithdrawalForm";
import DetailDialog from "@/components/ui/DetailDialog";
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
  phone?: string; address?: string; gender?: string; username?: string;
  suspendReason?: string; hasActiveInvestment?: boolean; referredBy?: string;
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
  details: ApiUser;
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
  return `₦${wallet.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
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
    details: u,
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
    <div ref={ref} onClick={(event) => event.stopPropagation()} className="relative inline-block">
      <button
        aria-label="User actions"
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
  onDetails,
}: {
  onDetails: () => void;
  user: User;
  onAction: (userId: string, action: "activate" | "suspend") => Promise<void>;
}) {
  const status = statusBadge[user.status];

  return (
    <div
      tabIndex={0}
      aria-label={`View details for ${user.name}`}
      onClick={onDetails}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onDetails();
        }
      }}
      className="flex cursor-pointer items-start gap-3 p-4 border-b border-[#eaf3e7] last:border-0 hover:bg-[#f9fcf8] focus-visible:outline-2 focus-visible:outline-primary transition-colors">
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
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-[#eaf3e7] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function UsersTable() {
  const [selected, setSelected] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const pendingAction = useRef(false);
  const requestController = useRef<AbortController | null>(null);

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

  // ── Fetch (params: page + q + status) ────────────────────────────────────
  const fetchUsers = useCallback(
    async (currentPage: number, q: string, status: string) => {
      requestController.current?.abort();
      const controller = new AbortController();
      requestController.current = controller;
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
          { credentials: "include", signal: controller.signal },
        );
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");

        if (controller.signal.aborted) return;
        setUsers((json.data as ApiUser[]).map(mapApiUser));
        setTotalPages(json.pages ?? 1);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [],
  );

  // Re-fetch whenever page, debouncedSearch, or statusFilter changes
  useEffect(() => {
    const timer = setTimeout(() => void fetchUsers(page, debouncedSearch, statusFilter), 0);
    return () => { clearTimeout(timer); requestController.current?.abort(); };
  }, [page, debouncedSearch, statusFilter, fetchUsers]);

  // ── Activate / suspend ─────────────────────────────────────────
  const handleAction = useCallback(
    async (userId: string, action: "activate" | "suspend") => {
      if (pendingAction.current) return;
      pendingAction.current = true;
      setActionBusy(true);
      setActionError(null);
      const newStatus: Status = action === "activate" ? "Active" : "Suspended";
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
        const updateUser = (user: User): User => user.id === userId
          ? { ...user, status: newStatus, details: { ...user.details, status: newStatus.toLowerCase() } }
          : user;
        setUsers((current) => current.map(updateUser));
        setSelected((current) => current ? updateUser(current) : null);
      } catch (err) {
        setActionError(
          err instanceof Error
            ? err.message
            : "Action failed. Please try again.",
        );
      } finally {
        pendingAction.current = false;
        setActionBusy(false);
      }
    },
    [],
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
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
            disabled={loading}
            title="Refresh"
          >
            <MdRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
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
      <div aria-busy={loading} className="bg-white border border-[#d5e7cf] rounded-xl overflow-hidden shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fcf8] border-b border-[#d5e7cf]">
                {[
                  "User ID",
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
              {loading && users.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                      tabIndex={0}
                      aria-label={`View details for ${user.name}`}
                      onClick={() => { setActionError(null); setSelected(user); }}
                      onKeyDown={(event) => {
                        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                          event.preventDefault();
                          setActionError(null);
                          setSelected(user);
                        }
                      }}
                      className="cursor-pointer hover:bg-[#f9fcf8] focus-visible:outline-2 focus-visible:outline-primary transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <span className="text-sm font-mono font-medium text-gray-600">
                          {user.userID}
                        </span>
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
          {loading && users.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-[#eaf3e7] animate-pulse flex gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#eaf3e7] rounded w-1/2" />
                    <div className="h-3 bg-[#eaf3e7] rounded w-3/4" />
                  </div>
                </div>
              ))
            : users.map((user) => (
                <UserCard key={user.id} user={user} onAction={handleAction} onDetails={() => { setActionError(null); setSelected(user); }} />
              ))}
        </div>

        {selected && <DetailDialog title="User details" onClose={() => setSelected(null)}>
        <div className="mb-6 flex items-center gap-4"><Image unoptimized src={selected.avatar} alt={selected.name} width={80} height={80} className="size-20 rounded-full object-cover" /><div><h3 className="text-xl font-semibold">{selected.name}</h3><p className="text-sm text-slate-500">{selected.userID}</p></div></div>
        <dl className="grid gap-5 text-sm sm:grid-cols-2">{[
          ["Email", selected.email], ["Phone", selected.details.phone], ["Address", selected.details.address], ["Gender", selected.details.gender],
          ["Status", selected.status], ["Verified", selected.isVerified ? "Yes" : "No"], ["Wallet balance", selected.balance], ["Wallet ID", selected.details.wallet?.walletId],
          ["Active investment", selected.details.hasActiveInvestment ? "Yes" : "No"], ["Referred by (user ID)", selected.details.referredBy], ["Suspension reason", selected.details.suspendReason],
          ["Registered", new Date(selected.details.createdAt).toLocaleString()], ["Last updated", new Date(selected.details.updatedAt).toLocaleString()],
        ].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words font-medium">{value || "Not provided"}</dd></div>)}</dl>
        <AdminWithdrawalForm key={selected.id} userId={selected.id} wallet={selected.details.wallet} onUpdate={(wallet) => {
          const update = (user: User): User => user.id === selected.id ? { ...user, balance: formatWalletBalance(wallet), details: { ...user.details, wallet } } : user;
          setUsers(current => current.map(update));
          setSelected(current => current ? update(current) : null);
        }} />
        {actionError && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5" aria-busy={actionBusy}>
          <button type="button" disabled={actionBusy || selected.status === "Active"} onClick={() => void handleAction(selected.id, "activate")} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40">
            <MdCheckCircle /> Activate User
          </button>
          <button type="button" disabled={actionBusy || selected.status === "Suspended"} onClick={() => void handleAction(selected.id, "suspend")} className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40">
            <MdBlock /> Suspend User
          </button>
        </div>
      </DetailDialog>}
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
