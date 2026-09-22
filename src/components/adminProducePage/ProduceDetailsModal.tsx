"use client";

import DetailDialog from "@/components/ui/DetailDialog";
import { TbEdit } from "react-icons/tb";
import TrackManager, { type ProduceTrack } from "./TrackManager";

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
  tracks: ProduceTrack[];
}

interface Props {
  produce: Produce;
  onClose: () => void;
  onEdit: () => void;
  onTracksChanged?: () => void;
}

const currency = (value: number) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0,
}).format(value);

export default function ProduceDetailsModal({ produce, onClose, onEdit, onTracksChanged }: Props) {
  const tracks = produce.tracks ?? [];
  const images = [produce.image1, produce.image2, produce.image3].filter((image) => image?.url);
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

        <TrackManager
          produceId={produce._id}
          duration={produce.duration}
          category={produce.category}
          initialTracks={tracks}
          onChanged={onTracksChanged}
        />
        <p className="break-all text-xs text-slate-400">Produce ID: {produce._id}</p>
      </div>
    </DetailDialog>
  );
}
