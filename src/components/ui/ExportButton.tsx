"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import {
  createCsv,
  createDocx,
  downloadExport,
  fetchExportRecords,
  type ExportData,
  type ExportParams,
} from "@/lib/exportRecords";

type Props<T> = {
  title: string;
  filename: string;
  endpoint: string;
  params: ExportParams;
  toData: (records: T[]) => ExportData;
  disabled?: boolean;
};

export default function ExportButton<T>({
  title,
  filename,
  endpoint,
  params,
  toData,
  disabled,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const dropdownId = useId();
  const dropdown = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!dropdown.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  async function run(format: "csv" | "docx" = "csv") {
    if (controller.current) return;
    setOpen(false);
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setMessage("");
    try {
      const records = await fetchExportRecords<T>(
        endpoint,
        params,
        request.signal,
      );
      if (!records.length) throw new Error("No records match these filters.");
      const data = toData(records);
      const blob =
        format === "csv"
          ? new Blob([createCsv(data)], { type: "text/csv;charset=utf-8" })
          : await createDocx(title, data);
      request.signal.throwIfAborted();
      downloadExport(
        blob,
        `${filename}-${new Date().toISOString().slice(0, 10)}.${format}`,
      );
      setMessage(`${records.length} records exported.`);
    } catch (error) {
      if (!request.signal.aborted)
        setMessage(
          error instanceof Error
            ? error.message
            : "Export failed. Please try again.",
        );
    } finally {
      if (!request.signal.aborted) setBusy(false);
      controller.current = null;
    }
  }

  return (
    <div className="flex max-w-full flex-col items-start gap-1">
      <div
        ref={dropdown}
        className="relative inline-flex"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      >
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy || disabled}
          title="Export all matching records as CSV"
          className="inline-flex h-11 items-center gap-2 rounded-l-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {busy ? "Exporting..." : "Export"}
        </button>
        <button
          ref={toggle}
          type="button"
          aria-label={`${title} export format`}
          aria-expanded={open && !busy && !disabled}
          aria-controls={dropdownId}
          disabled={busy || disabled}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 items-center rounded-r-lg border border-l-0 border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
        {open && !busy && !disabled && (
          <div
            id={dropdownId}
            className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {(["csv", "docx"] as const).map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => void run(format)}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-50"
              >
                Export {format.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="text-xs text-slate-500">All matching records</span>
      {message && (
        <p role="status" className="max-w-64 text-xs text-slate-600">
          {message}
        </p>
      )}
    </div>
  );
}
