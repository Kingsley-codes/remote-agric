// app/components/InvestmentForm.tsx
"use client";

import { useState } from "react";

export default function InvestmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "Crops",
    status: "Draft",
    roi: "",
    duration: "",
    price: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <div className="w-full xl:w-100 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex flex-col h-auto">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-t-xl">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            add_circle
          </span>
          New Opportunity
        </h3>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 flex flex-col gap-5 overflow-y-auto"
      >
        {/* Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Cover Image
          </label>
          <div className="h-32 w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
            <span className="material-symbols-outlined text-3xl mb-1">
              cloud_upload
            </span>
            <span className="text-xs font-medium">
              Click to upload or drag & drop
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Opportunity Name
            </span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g. Cashew Farm Extension"
              type="text"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
              </span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
              >
                <option>Crops</option>
                <option>Livestock</option>
                <option>Aquaculture</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Status
              </span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Sold Out</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                ROI (%)
              </span>
              <input
                name="roi"
                value={formData.roi}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="0"
                type="number"
                min="0"
                max="100"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Duration (Mo)
              </span>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="12"
                type="number"
                min="1"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Unit Price ($)
            </span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-serif italic">
                $
              </span>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="50.00"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Enter brief details..."
              rows={3}
            />
          </label>
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex gap-3 mt-auto">
          <button
            type="button"
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-lg bg-primary hover:bg-opacity-90 text-black font-bold transition-colors shadow-sm shadow-primary/30"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
