"use client";

import { stageLabel } from "@/lib/farmProgress";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { GiGoat, GiDoubleFish, GiGrass } from "react-icons/gi";
import EditOpportunityModal from "./EditOpportunityModal";
import ConfirmModal from "./ConfirmModal";
import ProduceDetailsModal from "./ProduceDetailsModal";

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
  profit: number;
  remainingUnit: number;
  image1: { url: string };
  image2: { url: string };
  image3: { url: string };
  stage: string;
  status: string;
  rolloverProfit: number;
  tracks: Array<{ _id: string; name: string; startMonth: number; endMonth: number; stage: string }>;
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const updateStatus = async (value: string) => {
    setSaving("status");
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${investment._id}/status`, { status: value }, { withCredentials: true });
      toast.success(value === "closed" ? "Opportunity closed" : "Opportunity activated");
      refreshInvestments?.();
    } catch (error) { toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update status" : "Unable to update status"); }
    finally { setSaving(null); }
  };
  const updateTrackStage = async (trackId: string, stage: string) => {
    setSaving(trackId);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${investment._id}/tracks/${trackId}/stage`, { stage }, { withCredentials: true });
      toast.success("Track stage updated and its farm owners notified");
      refreshInvestments?.();
    } catch (error) { toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update track" : "Unable to update track"); }
    finally { setSaving(null); }
  };
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
        toast.success("Farm listing deleted successfully!");
        onDeleteSuccess?.();
        refreshInvestments?.();
      }
    } catch (error: unknown) {
      console.error("Error deleting investment:", error);
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to delete farm listing",
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
      {isDetailsModalOpen && (
        <ProduceDetailsModal
          produce={investment}
          onClose={() => setIsDetailsModalOpen(false)}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onStatusChange={(status) => void updateStatus(status)}
          onTrackStageChange={(trackId, stage) => void updateTrackStage(trackId, stage)}
          saving={saving}
        />
      )}
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
        title="Delete Farm Listing"
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

  /* •”€•”€ MOBILE CARD •”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€ */
  if (mobileCard) {
    return (
      <>
        <div
          className="cursor-pointer space-y-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
          role="button"
          tabIndex={0}
          onClick={() => setIsDetailsModalOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsDetailsModalOpen(true);
            }
          }}
          aria-label={`View details for ${investment.title}`}
        >
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
                onClick={(event) => {
                  event.stopPropagation();
                  setIsConfirmModalOpen(true);
                }}
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
                profit
              </p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {investment.profit}%
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
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Tracks</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{(investment.tracks ?? []).length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Status</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{stageLabel(investment.status)}</p>
            </div>
          </div>
        </div>
        {modals}
      </>
    );
  }

  /* •”€•”€ DESKTOP TABLE ROW •”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€•”€ */
  return (
    <>
      <tr
        className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
        tabIndex={0}
        onClick={() => setIsDetailsModalOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsDetailsModalOpen(true);
          }
        }}
        aria-label={`View details for ${investment.title}`}
      >
        <td className="px-3 py-4">
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

        <td className="px-3 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryStyles(investment.category)}`}
          >
            <span className="text-[13px]">
              {getCategoryIcon(investment.category)}
            </span>
            <span className="capitalize">{investment.category}</span>
          </span>
        </td>

        <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
          {(investment.tracks ?? []).length}
        </td>
        <td className="px-3 py-4">
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {stageLabel(investment.status)}
          </span>
        </td>

        <td className="px-3 py-4 text-right font-bold text-slate-900 dark:text-white">
          {investment.profit}%
        </td>

        <td className="px-3 py-4 text-right text-slate-600 dark:text-slate-400">
          {formatDuration(investment.duration)}
        </td>

        <td className="px-3 py-4 text-right text-slate-700 dark:text-slate-300">
          {investment.totalUnit.toLocaleString()}
        </td>

        <td className="px-3 py-4">
          <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
            <button
              onClick={(event) => {
                event.stopPropagation();
                setIsConfirmModalOpen(true);
              }}
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
