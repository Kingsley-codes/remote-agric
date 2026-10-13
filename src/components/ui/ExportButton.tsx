"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { createCsv, createDocx, downloadExport, fetchExportRecords, type ExportData, type ExportParams } from "@/lib/exportRecords";

type Props<T> = {
  title: string;
  filename: string;
  endpoint: string;
  params: ExportParams;
  toData: (records: T[]) => ExportData;
  disabled?: boolean;
};

export default function ExportButton<T>({ title, filename, endpoint, params, toData, disabled }: Props<T>) {
  const [format, setFormat] = useState("csv");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function run() {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setBusy(true); setMessage("");
    try {
      const records = await fetchExportRecords<T>(endpoint, params, request.signal);
      if (!records.length) throw new Error("No records match these filters.");
      const data = toData(records);
      const blob = format === "csv" ? new Blob([createCsv(data)], { type: "text/csv;charset=utf-8" }) : await createDocx(title, data);
      request.signal.throwIfAborted();
      downloadExport(blob, `${filename}-${new Date().toISOString().slice(0, 10)}.${format}`);
      setMessage(`${records.length} records exported.`);
    } catch (error) {
      if (!request.signal.aborted) setMessage(error instanceof Error ? error.message : "Export failed. Please try again.");
    } finally {
      if (!request.signal.aborted) setBusy(false);
      controller.current = null;
    }
  }

  return <div className="flex max-w-full flex-col items-start gap-1">
    <div className="flex items-center gap-2">
      <select aria-label={`${title} export format`} value={format} onChange={event => setFormat(event.target.value)} disabled={busy || disabled} className="h-11 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 disabled:opacity-50">
        <option value="csv">CSV</option><option value="docx">DOCX</option>
      </select>
      <button type="button" onClick={() => void run()} disabled={busy || disabled} title="Export all records matching the current filters" className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}{busy ? "Exporting..." : "Export"}
      </button>
    </div>
    <span className="text-xs text-slate-500">All matching records</span>
    {message && <p role="status" className="max-w-64 text-xs text-slate-600">{message}</p>}
  </div>;
}
