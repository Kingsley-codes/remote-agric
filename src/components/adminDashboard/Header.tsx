"use client";

import { IoIosNotifications } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { UserData } from "@/components/adminDashboard/Sidebar";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem("admin");
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    };

    fetchUser();
  }, []);

  const firstName = user?.firstName ?? user?.name?.split(" ")[0] ?? "there";

  return (
    <header className="bg-white/80 dark:bg-[#0f1a0c]/80 backdrop-blur-md z-30 border-b border-slate-200 dark:border-slate-800">
      {/* Main row */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-20">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-800 dark:text-white truncate">
          Welcome back, {firstName}
        </h2>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 shrink-0 ml-3">
          {/* Desktop search */}
          <div className="hidden lg:flex relative items-center h-10 w-64 lg:w-80 bg-slate-100 dark:bg-white/5 rounded-xl px-4 border border-transparent focus-within:border-primary transition-colors">
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 pr-7"
              placeholder="Search users, IDs..."
              type="text"
            />
            <FaSearch className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mobile search toggle */}
          <button
            className="md:hidden size-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
          >
            <FaSearch className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button className="size-9 sm:size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative">
            <IoIosNotifications className="text-gray-700 h-5 w-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-black" />
          </button>
        </div>
      </div>

      {/* Mobile expandable search */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3">
          <div className="relative flex items-center h-10 bg-slate-100 dark:bg-white/5 rounded-xl px-4 border border-transparent focus-within:border-primary transition-colors">
            <input
              autoFocus
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 pr-7"
              placeholder="Search users, IDs..."
              type="text"
            />
            <FaSearch className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}
    </header>
  );
}
