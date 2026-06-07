// app/admin/audit-logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { MdHistory, MdRefresh } from "react-icons/md";
import { AuditLog, AuditLogFilters, AuditLogStats } from "@/lib/auditLog";
import AuditLogStatsCards from "@/components/AuditLogPage/AuditLogStats";
import AuditLogTable from "@/components/AuditLogPage/AuditLogTable";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [currentPage, filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.action && { action: filters.action }),
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(
        `${BACKEND_URL}/api/admin/audit-logs?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to fetch audit logs",
        );
      }

      setLogs(data.data.logs);
      setTotalCount(data.data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/audit-logs/stats`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      setStats(data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.action && { action: filters.action }),
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(
        `${BACKEND_URL}/api/admin/audit-logs/export?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export audit logs");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8faf6] to-white">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#5e9a4c]/10 rounded-lg">
              <MdHistory className="text-2xl text-[#5e9a4c]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111b0d]">Audit Logs</h1>
              <p className="text-gray-600 mt-1">
                Track and monitor all system activities, changes, and user
                actions
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <AuditLogStatsCards stats={stats} loading={loadingStats} />

        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              fetchAuditLogs();
              fetchStats();
            }}
            disabled={loading}
            className="px-4 py-2 bg-white border border-[#d5e7cf] rounded-lg text-[#2d4a1e] hover:bg-[#eaf3e7] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <MdRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Audit Log Table */}
        <AuditLogTable
          logs={logs}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onFilterChange={setFilters}
          onExport={handleExport}
          loading={loading}
        />
      </div>
    </div>
  );
}
