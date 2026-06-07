// app/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/adminDashboard/Header";
import StatsCards from "@/components/adminProducePage/StatsCards";
import InvestmentTable from "@/components/adminProducePage/InvestmentTable";
import NewOpportunityModal from "@/components/adminProducePage/AddProduce";
import { IoIosAdd, IoMdDownload } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";

export default function Producepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-col min-h-0">
      <Header />

      <div className="p-6">
        <div className="max-w-400 mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Opportunities
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage active listings, track ROI, and create new investment
              vehicles.
            </p>
          </div>

          <StatsCards />

          <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-xl font-bold pt-2 md:pb-3 pb-0 text-slate-900 dark:text-white">
                Active Listings
              </h2>

              <div className=" flex justify-end px-2 py-3">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <IoFilterSharp className="text-slate-600 dark:text-slate-300 text-[20px]" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <IoMdDownload className="text-slate-600 dark:text-slate-300 text-[20px]" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <IoIosAdd className="text-white h-5 w-5 shrink-0" />
                    <span className="hidden sm:inline">New Project</span>
                  </button>
                </div>
              </div>
            </div>
            <InvestmentTable />
          </div>
        </div>
      </div>

      <NewOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
