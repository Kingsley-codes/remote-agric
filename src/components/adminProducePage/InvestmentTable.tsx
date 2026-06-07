"use client";

import { useState, useEffect } from "react";
import InvestmentRow from "./InvestmentRow";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

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
  ROI: number;
  remainingUnit: number;
  image1: { url: string };
  image2: { url: string };
  image3: { url: string };
  createdAt: string;
  updatedAt: string;
}

export default function InvestmentTable() {
  const [investments, setInvestments] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce`,
        { withCredentials: true },
      );
      if (response.data.produce) {
        setInvestments(response.data.produce);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    toast.success("Investment updated successfully!");
    fetchInvestments();
  };

  const handleDeleteSuccess = () => {
    toast.success("Investment deleted successfully!");
    fetchInvestments();
  };

  const filteredInvestments = investments.filter(
    (investment) =>
      investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.produceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
          Active Listings
        </h3>
        <div className="relative border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg flex items-center gap-2 w-full sm:max-w-md">
          <FaSearch className="text-gray-400 h-4 w-4 shrink-0" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            placeholder="Search projects..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredInvestments.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
          No investments found
        </div>
      ) : (
        <>
          {/* MOBILE CARDS */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInvestments.map((investment) => (
              <InvestmentRow
                key={investment._id}
                investment={investment}
                onEditSuccess={handleEditSuccess}
                onDeleteSuccess={handleDeleteSuccess}
                refreshInvestments={fetchInvestments}
                mobileCard
              />
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="px-6 py-4">Investment Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">ROI</th>
                  <th className="px-6 py-4 text-right">Duration</th>
                  <th className="px-6 py-4 text-right">Total Units</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredInvestments.map((investment) => (
                  <InvestmentRow
                    key={investment._id}
                    investment={investment}
                    onEditSuccess={handleEditSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                    refreshInvestments={fetchInvestments}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between mt-auto">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredInvestments.length} of {investments.length} listings
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
