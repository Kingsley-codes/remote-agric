"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { stageLabel, stagesByCategory } from "@/lib/farmProgress";

export interface ProduceTrack {
  _id: string;
  name: string;
  startMonth: number;
  endMonth: number;
  stage: string;
}

interface Props {
  produceId: string;
  duration: number;
  category: string;
  initialTracks: ProduceTrack[];
  onChanged?: () => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const monthSpan = (startMonth: number, endMonth: number) =>
  ((endMonth - startMonth + 12) % 12) + 1;
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-primary/30 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

export default function TrackManager({ produceId, duration, category, initialTracks, onChanged }: Props) {
  const [tracks, setTracks] = useState(initialTracks);
  const [name, setName] = useState("");
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const stages = stagesByCategory[category] ?? stagesByCategory.crops;
  const span = useMemo(() => monthSpan(startMonth, endMonth), [startMonth, endMonth]);
  const valid = Number.isInteger(duration) && duration >= 1 && duration <= 12 && span === duration;

  const addTrack = async () => {
    if (!valid || busy) return;
    setBusy("add");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${produceId}/tracks`,
        { name: name.trim() || undefined, startMonth, endMonth },
        { withCredentials: true },
      );
      const track = response.data?.data?.track as ProduceTrack | undefined;
      if (!track) throw new Error("The server did not return the new track");
      setTracks((current) => [...current, track]);
      setName("");
      setShowForm(false);
      toast.success("Track added successfully");
      onChanged?.();
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to add track" : error instanceof Error ? error.message : "Unable to add track");
    } finally {
      setBusy(null);
    }
  };

  const deleteTrack = async (track: ProduceTrack) => {
    if (busy || !window.confirm(`Delete ?${track.name}?? This is only allowed when the track has no investments.`)) return;
    setBusy(track._id);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${produceId}/tracks/${track._id}`,
        { withCredentials: true },
      );
      setTracks((current) => current.filter((item) => item._id !== track._id));
      toast.success("Track deleted successfully");
      onChanged?.();
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to delete track" : "Unable to delete track");
    } finally {
      setBusy(null);
    }
  };

  const updateStage = async (trackId: string, stage: string) => {
    if (busy) return;
    setBusy(trackId);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${produceId}/tracks/${trackId}/stage`,
        { stage },
        { withCredentials: true },
      );
      setTracks((current) => current.map((track) => track._id === trackId ? { ...track, stage } : track));
      toast.success("Track stage updated and its farm owners notified");
      onChanged?.();
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update track" : "Unable to update track");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Tracks</h3>
          <p className="mt-1 text-xs text-slate-500">Each track must span exactly {duration} month{duration === 1 ? "" : "s"}.</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} disabled={busy !== null} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-bold text-primary disabled:opacity-50">
          <IoIosAdd className="h-5 w-5" /> Add track
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-xl border border-primary/20 bg-green-50/50 p-4 dark:bg-slate-900/40">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name (optional)
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder={`${months[startMonth - 1]}-${months[endMonth - 1]}`} className={`mt-1 ${inputClass}`} disabled={busy !== null} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Starts
              <select value={startMonth} onChange={(event) => setStartMonth(Number(event.target.value))} className={`mt-1 ${inputClass}`} disabled={busy !== null}>
                {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Ends
              <select value={endMonth} onChange={(event) => setEndMonth(Number(event.target.value))} className={`mt-1 ${inputClass}`} disabled={busy !== null}>
                {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
              </select>
            </label>
          </div>
          <p className={`text-xs ${valid ? "text-slate-500" : "text-red-600"}`}>{months[startMonth - 1]}?{months[endMonth - 1]} ? {span} month{span === 1 ? "" : "s"}</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} disabled={busy !== null} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">Cancel</button>
            <button type="button" onClick={() => void addTrack()} disabled={!valid || busy !== null} className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50">{busy === "add" ? "Adding?" : "Save track"}</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tracks.map((track) => (
          <div key={track._id} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-[1fr_12rem_auto] sm:items-center">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{track.name}</p>
              <p className="mt-1 text-xs text-slate-500">{months[track.startMonth - 1]} to {months[track.endMonth - 1]}</p>
            </div>
            <select aria-label={`Stage for ${track.name}`} value={track.stage} disabled={busy !== null} onChange={(event) => void updateStage(track._id, event.target.value)} className={inputClass}>
              {!stages.includes(track.stage) && <option value={track.stage}>{stageLabel(track.stage)}</option>}
              {stages.map((stage) => <option key={stage} value={stage}>{stageLabel(stage)}</option>)}
            </select>
            <button type="button" onClick={() => void deleteTrack(track)} disabled={busy !== null || tracks.length === 1} title={tracks.length === 1 ? "A produce must have at least one track" : `Delete ${track.name}`} aria-label={`Delete ${track.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-30 dark:hover:bg-red-900/20">
              <MdDelete className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
