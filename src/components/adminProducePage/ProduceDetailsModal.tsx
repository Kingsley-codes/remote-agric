"use client";

import DetailDialog from "@/components/ui/DetailDialog";
import { stageLabel, stagesByCategory } from "@/lib/farmProgress";
import { TbEdit } from "react-icons/tb";

interface Track { _id: string; name: string; startMonth: number; endMonth: number; stage: string }
interface Produce {
  _id: string;
  produceName: string;
  title: string;
  description: string;
  totalUnit: number;
  minimumUnit: number;
  price: number;
  category: string;
  duration: number;
  profit: number;
  remainingUnit: number;
  image1: { url: string };
  image2: { url: string };
  image3: { url: string };
  status: string;
  rolloverProfit: number;
  tracks: Track[];
}

interface Props {
  produce: Produce;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
  onTrackStageChange: (trackId: string, stage: string) => void;
  saving: string | null;
}

const currency = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0,
}).format(value);

export default function ProduceDetailsModal({ produce, onClose, onEdit, onStatusChange, onTrackStageChange, saving }: Props) {
  const tracks = produce.tracks ?? [];
  const stages = stagesByCategory[produce.category] ?? stagesByCategory.crops;
  const images = [produce.image1, produce.image2, produce.image3].filter((image) => image?.url);
  const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-primary/30 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  const facts = [
    ["Unit price", currency(produce.price)],
    ["Minimum units", produce.minimumUnit.toLocaleString()],
    ["Total units", produce.totalUnit.toLocaleString()],
    ["Remaining units", produce.remainingUnit.toLocaleString()],
    ["Profit", `${produce.profit}%`],
    ["Rollover profit", `${produce.rolloverProfit}%`],
    ["Duration", `${produce.duration} month${produce.duration === 1 ? "" : "s"}`],
    ["Tracks", tracks.length.toLocaleString()],
  ];

  return (
    <DetailDialog title={produce.title} onClose={onClose}>
      <div className="space-y-6">
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className={`rounded-xl bg-slate-100 bg-cover bg-center ${index === 0 ? "col-span-3 h-52 sm:col-span-2 sm:row-span-2 sm:h-full" : "h-28"}`}
                style={{ backgroundImage: `url('${image.url}')` }}
                role="img"
                aria-label={`${produce.title} image ${index + 1}`}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold capitalize text-primary">{produce.produceName} ? {produce.category}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
              {produce.description || "No description provided."}
            </p>
          </div>
          <button type="button" onClick={onEdit} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
            <TbEdit className="h-4 w-4" /> Edit produce
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <dt className="text-xs font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:items-center">
          <label htmlFor={`status-${produce._id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-200">Listing status</label>
          <select id={`status-${produce._id}`} value={produce.status} disabled={saving !== null} onChange={(event) => onStatusChange(event.target.value)} className={selectClass}>
            {!['active', 'closed'].includes(produce.status) && <option value={produce.status}>{stageLabel(produce.status)}</option>}
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 dark:text-white">Tracks</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
            </span>
          </div>
          {tracks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500 dark:border-slate-700">No tracks are available for this produce.</p>
          ) : (
            <div className="space-y-3">
              {tracks.map((track) => (
                <div key={track._id} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-[1fr_12rem] sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{track.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Month {track.startMonth} to {track.endMonth}</p>
                  </div>
                  <select aria-label={`Stage for ${track.name}`} value={track.stage} disabled={saving !== null} onChange={(event) => onTrackStageChange(track._id, event.target.value)} className={selectClass}>
                    {!stages.includes(track.stage) && <option value={track.stage}>{stageLabel(track.stage)}</option>}
                    {stages.map((stage) => <option key={stage} value={stage}>{stageLabel(stage)}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>
        <p className="break-all text-xs text-slate-400">Produce ID: {produce._id}</p>
      </div>
    </DetailDialog>
  );
}
