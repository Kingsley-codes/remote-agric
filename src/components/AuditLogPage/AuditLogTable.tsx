// components/admin/AuditLogTable.tsx
"use client";

import { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdDownload,
  MdVisibility,
  MdClose,
  MdPerson,
  MdAgriculture,
  MdShoppingCart,
  MdPayment,
  MdAdminPanelSettings,
  MdCreate,
  MdDelete,
  MdUpdate,
  MdTimeline,
  MdAttachMoney,
  MdLocalShipping,
  MdLogin,
  MdLogout,
  MdWarning,
} from "react-icons/md";
import { AuditLog, AuditLogFilters } from "@/lib/auditLog";

interface AuditLogTableProps {
  logs: AuditLog[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: AuditLogFilters) => void;
  onExport: () => void;
  loading?: boolean;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-green-50 text-green-700 border-green-200",
  UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
  STATUS_CHANGE: "bg-purple-50 text-purple-700 border-purple-200",
  FUNDING_UPDATE: "bg-yellow-50 text-yellow-700 border-yellow-200",
  YIELD_MARKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  LOGIN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LOGOUT: "bg-gray-50 text-gray-700 border-gray-200",
};

// Fix: Change JSX.Element to React.ReactElement
const actionIcons: Record<string, React.ReactElement> = {
  CREATE: <MdCreate className="text-sm" />,
  UPDATE: <MdUpdate className="text-sm" />,
  DELETE: <MdDelete className="text-sm" />,
  STATUS_CHANGE: <MdTimeline className="text-sm" />,
  FUNDING_UPDATE: <MdAttachMoney className="text-sm" />,
  YIELD_MARKED: <MdLocalShipping className="text-sm" />,
  LOGIN: <MdLogin className="text-sm" />,
  LOGOUT: <MdLogout className="text-sm" />,
};

// Fix: Change JSX.Element to React.ReactElement
const entityIcons: Record<string, React.ReactElement> = {
  FARMER: <MdAgriculture className="text-sm" />,
  PRODUCT: <MdShoppingCart className="text-sm" />,
  ORDER: <MdLocalShipping className="text-sm" />,
  USER: <MdPerson className="text-sm" />,
  PAYMENT: <MdPayment className="text-sm" />,
  WITHDRAWAL: <MdPayment className="text-sm" />,
  ADMIN: <MdAdminPanelSettings className="text-sm" />,
};

export default function AuditLogTable({
  logs,
  totalCount,
  currentPage,
  onPageChange,
  onFilterChange,
  onExport,
  loading = false,
}: AuditLogTableProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState<AuditLogFilters>({});

  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const getChangeSummary = (log: AuditLog) => {
    if (log.action === "CREATE") {
      return `Created new ${log.entityType.toLowerCase()}`;
    }
    if (log.action === "DELETE") {
      return `Deleted ${log.entityType.toLowerCase()}`;
    }
    if (log.action === "UPDATE" && log.changes.field) {
      return `Updated ${log.changes.field} from "${log.changes.oldValue}" to "${log.changes.newValue}"`;
    }
    if (log.action === "STATUS_CHANGE") {
      return `Changed status from "${log.changes.oldValue}" to "${log.changes.newValue}"`;
    }
    if (log.action === "FUNDING_UPDATE") {
      return `Updated funding from ₦${log.changes.oldValue} to ₦${log.changes.newValue}`;
    }
    if (log.action === "YIELD_MARKED") {
      return `Marked yield as received`;
    }
    if (log.action === "LOGIN") {
      return `User logged in`;
    }
    if (log.action === "LOGOUT") {
      return `User logged out`;
    }
    return log.details || `${log.action} operation performed`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#d5e7cf] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d5e7cf] bg-linear-to-r from-[#f8faf6] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#111b0d]">Audit Logs</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track all system activities and changes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-[#d5e7cf] rounded-lg text-[#2d4a1e] hover:bg-[#eaf3e7] transition-colors flex items-center gap-2"
            >
              <MdFilterList className="text-lg" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#5e9a4c] text-white text-xs rounded-full">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2 bg-[#5e9a4c] text-white rounded-lg hover:bg-[#2d4a1e] transition-colors flex items-center gap-2"
            >
              <MdDownload className="text-lg" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-[#d5e7cf]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-[#5e9a4c]/50 focus:border-[#5e9a4c] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-[#5e9a4c]/50 focus:border-[#5e9a4c] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Action
                </label>
                <select
                  value={filters.action || ""}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-[#5e9a4c]/50 focus:border-[#5e9a4c] outline-none text-sm"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="STATUS_CHANGE">Status Change</option>
                  <option value="FUNDING_UPDATE">Funding Update</option>
                  <option value="YIELD_MARKED">Yield Marked</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Entity Type
                </label>
                <select
                  value={filters.entityType || ""}
                  onChange={(e) =>
                    handleFilterChange("entityType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-[#5e9a4c]/50 focus:border-[#5e9a4c] outline-none text-sm"
                >
                  <option value="">All Entities</option>
                  <option value="FARMER">Farmer</option>
                  <option value="PRODUCT">Product</option>
                  <option value="ORDER">Order</option>
                  <option value="USER">User</option>
                  <option value="PAYMENT">Payment</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Search
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by user name, email, entity ID..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-[#5e9a4c]/50 focus:border-[#5e9a4c] outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[#d5e7cf]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Changes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d5e7cf]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-[#5e9a4c] border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <MdWarning className="text-4xl mx-auto mb-2 text-gray-300" />
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const { date, time } = formatTimestamp(log.timestamp);
                return (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {date}
                      </div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${actionColors[log.action]}`}
                      >
                        {actionIcons[log.action]}
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          {entityIcons[log.entityType]}
                        </span>
                        <span className="text-sm text-gray-900">
                          {log.entityType}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          #{log.entityId.slice(-6)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-[#5e9a4c] to-[#2d4a1e] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.userName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-md">
                        {getChangeSummary(log)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="text-[#5e9a4c] hover:text-[#2d4a1e] transition-colors"
                      >
                        <MdVisibility className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#d5e7cf] flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{" "}
            to {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
            {totalCount} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#d5e7cf] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#d5e7cf] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <AuditLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

// Detail Modal Component
function AuditLogDetailModal({
  log,
  onClose,
}: {
  log: AuditLog;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative bg-linear-to-r from-[#2d4a1e] to-[#5e9a4c] px-6 py-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {actionIcons[log.action]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Audit Log Details
              </h2>
              <p className="text-white/80 text-sm">
                {log.action.replace("_", " ")} operation on {log.entityType}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#111b0d] mb-3 pb-2 border-b border-[#d5e7cf]">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </label>
                  <p className="text-gray-800">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Entity ID
                  </label>
                  <p className="text-gray-800 font-mono text-sm">
                    {log.entityId}
                  </p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#111b0d] mb-3 pb-2 border-b border-[#d5e7cf]">
                User Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <p className="text-gray-800">{log.userName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-gray-800">{log.userEmail}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Role
                  </label>
                  <p className="text-gray-800">{log.userRole}</p>
                </div>
              </div>
            </div>

            {/* Changes */}
            {Object.keys(log.changes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#111b0d] mb-3 pb-2 border-b border-[#d5e7cf]">
                  Changes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Details */}
            {log.details && (
              <div>
                <h3 className="text-lg font-semibold text-[#111b0d] mb-3 pb-2 border-b border-[#d5e7cf]">
                  Additional Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{log.details}</p>
                </div>
              </div>
            )}

            {/* Technical Details */}
            {(log.ipAddress || log.userAgent) && (
              <div>
                <h3 className="text-lg font-semibold text-[#111b0d] mb-3 pb-2 border-b border-[#d5e7cf]">
                  Technical Details
                </h3>
                {log.ipAddress && (
                  <div className="mb-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      IP Address
                    </label>
                    <p className="text-gray-800 font-mono text-sm">
                      {log.ipAddress}
                    </p>
                  </div>
                )}
                {log.userAgent && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      User Agent
                    </label>
                    <p className="text-gray-800 text-sm break-all">
                      {log.userAgent}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-[#d5e7cf] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5e9a4c] text-white rounded-lg hover:bg-[#2d4a1e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
