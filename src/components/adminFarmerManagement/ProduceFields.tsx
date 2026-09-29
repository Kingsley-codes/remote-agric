"use client";

import { useId } from "react";
import { Plus, Trash2 } from "lucide-react";

export type ProduceEntry = { name: string; category: "" | "livestock" | "crops" | "aquaculture"; farmingCapacityKg: number | "" };
export const emptyProduce = (): ProduceEntry => ({ name: "", category: "", farmingCapacityKg: "" });
export function produceError(entries: ProduceEntry[]): string | null {
  if (!entries.length || entries.some((entry) => !entry.name.trim() || entry.name.trim().length > 100 || !entry.category || !Number.isFinite(Number(entry.farmingCapacityKg)) || Number(entry.farmingCapacityKg) <= 0)) {
    return "Enter a name, category, and farming capacity greater than zero for every produce.";
  }
  const keys = entries.map((entry) => `${entry.category}:${entry.name.trim().replace(/\s+/g, " ").toLowerCase()}`);
  return new Set(keys).size !== keys.length ? "Enter each produce only once per category." : null;
}

export default function ProduceFields({ value, onChange, disabled = false }: { value: ProduceEntry[]; onChange: (value: ProduceEntry[]) => void; disabled?: boolean }) {
  const id = useId();
  const update = (index: number, patch: Partial<ProduceEntry>) => onChange(value.map((entry, i) => i === index ? { ...entry, ...patch } : entry));
  const inputClass = "mt-1 w-full rounded-lg border border-[#d5e7cf] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary disabled:opacity-60";
  return <fieldset disabled={disabled} className="space-y-3">
    <legend className="text-sm font-semibold text-gray-800">Produce cultivated <span className="text-red-500">*</span></legend>
    <p className="text-xs text-gray-500">Add each produce and the quantity this producer can cultivate in kilograms.</p>
    {value.map((entry, index) => <div key={index} className="rounded-xl border border-[#d5e7cf] bg-[#f7faf5] p-4">
      <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-primary">Produce {index + 1}</span><button type="button" disabled={value.length === 1} onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove produce ${index + 1}`} className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"><Trash2 size={16} /></button></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label htmlFor={`${id}-${index}-name`} className="text-xs font-medium text-gray-700">Produce name</label><input id={`${id}-${index}-name`} required maxLength={100} value={entry.name} onChange={(event) => update(index, { name: event.target.value })} placeholder="e.g., Maize, Catfish, Poultry" className={inputClass} /></div>
        <div><label htmlFor={`${id}-${index}-category`} className="text-xs font-medium text-gray-700">Category</label><select id={`${id}-${index}-category`} required value={entry.category} onChange={(event) => update(index, { category: event.target.value as ProduceEntry["category"] })} className={inputClass}><option value="">Select category</option><option value="livestock">Livestock</option><option value="crops">Crops</option><option value="aquaculture">Aquaculture</option></select></div>
        <div><label htmlFor={`${id}-${index}-capacity`} className="text-xs font-medium text-gray-700">Farming capacity (kg)</label><input id={`${id}-${index}-capacity`} type="number" required min="0" step="any" value={entry.farmingCapacityKg} onChange={(event) => update(index, { farmingCapacityKg: event.target.value === "" ? "" : Number(event.target.value) })} placeholder="e.g., 2500" className={inputClass} /></div>
      </div>
    </div>)}
    <button type="button" onClick={() => onChange([...value, emptyProduce()])} className="inline-flex items-center gap-2 rounded-lg border border-[#d5e7cf] px-4 py-2 text-sm font-medium text-primary hover:bg-[#eaf3e7]"><Plus size={16} />Add more produce</button>
  </fieldset>;
}
