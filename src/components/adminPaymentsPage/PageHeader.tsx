"use client";

import { MdNotifications, MdAdd } from "react-icons/md";

export default function PageHeader() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl pb-2 font-semibold tracking-tight text-gray-800">
          Investment Details
        </h2>
        <p className="text-slate-500 text-sm">
          Monitor and manage Remote Farmer contributions
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:bg-primary/10 rounded-full transition-colors relative">
          <MdNotifications size={22} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-white"></span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all text-sm">
          <MdAdd size={18} />
          Export Report
        </button>
      </div>
    </header>
  );
}
