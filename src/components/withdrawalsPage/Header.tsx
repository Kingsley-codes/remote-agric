"use client";
import { MdSearch, MdNotifications, MdDownload } from "react-icons/md";

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <MdSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search transactions, users..."
          className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <MdNotifications size={20} />
        </button>
        <button className="bg-primary text-background-dark font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2">
          <MdDownload size={16} />
          Export CSV
        </button>
      </div>
    </header>
  );
}
