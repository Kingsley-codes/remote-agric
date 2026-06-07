"use client";

import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { GiGoat, GiDoubleFish, GiGrass } from "react-icons/gi";
import EditOpportunityModal from "./EditOpportunityModal";
import ConfirmModal from "./ConfirmModal";

interface Investment {
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
}

interface InvestmentRowProps {
  investment: Investment;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
  refreshInvestments?: () => void;
  mobileCard?: boolean;
}

export default function InvestmentRow({
  investment,
  onEditSuccess,
  onDeleteSuccess,
  refreshInvestments,
  mobileCard = false,
}: InvestmentRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "crops":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800";
      case "livestock":
        return "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800";
      case "aquaculture":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "crops":
        return <GiGrass />;
      case "livestock":
        return <GiGoat />;
      case "aquaculture":
        return <GiDoubleFish />;
      default:
        return null;
    }
  };

  const formatDuration = (months: number) =>
    `${months} Month${months !== 1 ? "s" : ""}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${investment._id}`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        toast.success("Investment deleted successfully!");
        onDeleteSuccess?.();
        refreshInvestments?.();
      }
    } catch (error: unknown) {
      console.error("Error deleting investment:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to delete investment",
      );
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onEditSuccess?.();
    refreshInvestments?.();
  };

  const modals = (
    <>
      {isEditModalOpen && (
        <EditOpportunityModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          investment={investment}
          onSuccess={handleEditSuccess}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Delete Investment"
        message={`Are you sure you want to delete "${investment.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
        loading={isDeleting}
      />
    </>
  );

  /* ── MOBILE CARD ─────────────────────────────────────────── */
  if (mobileCard) {
    return (
      <>
        <div className="p-4 space-y-3">
          {/* Top row: image + title + actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="size-11 rounded-lg bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url('${investment.image1.url}')` }}
                aria-label={`Image for ${investment.title}`}
              />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                  {investment.title}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {investment.produceName}
                </p>
              </div>
            </div>

            {/* Actions — always visible on mobile (no hover gate) */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                title="Edit"
                disabled={isDeleting}
              >
                <TbEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                title="Delete"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                ) : (
                  <MdDelete className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                ROI
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {investment.ROI}%
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                Duration
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {formatDuration(investment.duration)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">
                Units
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {investment.totalUnit.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Category badge */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryStyles(investment.category)}`}
            >
              <span className="text-[13px]">
                {getCategoryIcon(investment.category)}
              </span>
              <span className="capitalize">{investment.category}</span>
            </span>
          </div>
        </div>
        {modals}
      </>
    );
  }

  /* ── DESKTOP TABLE ROW ───────────────────────────────────── */
  return (
    <>
      <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="size-10 rounded-lg bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url('${investment.image1.url}')` }}
              aria-label={`Icon representing ${investment.title}`}
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">
                {investment.title}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {investment.produceName}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryStyles(investment.category)}`}
          >
            <span className="text-[13px]">
              {getCategoryIcon(investment.category)}
            </span>
            <span className="capitalize">{investment.category}</span>
          </span>
        </td>

        <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
          {investment.ROI}%
        </td>

        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
          {formatDuration(investment.duration)}
        </td>

        <td className="px-6 py-4 text-right text-slate-700 dark:text-slate-300">
          {investment.totalUnit.toLocaleString()}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Edit"
              disabled={isDeleting}
            >
              <TbEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
              ) : (
                <MdDelete className="w-4 h-4" />
              )}
            </button>
          </div>
        </td>
      </tr>
      {modals}
    </>
  );
}
