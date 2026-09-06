"use client";

import { stagesByCategory, stageLabel } from "@/lib/farmProgress";
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
  stage: string;
  status: string;
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
  const [saving, setSaving] = useState<"stage" | "status" | null>(null);
  const stages = stagesByCategory[investment.category] ?? stagesByCategory.crops;
  const updateField = async (field: "stage" | "status", value: string) => {
    setSaving(field);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/produce/${investment._id}/${field}`, { [field]: value }, { withCredentials: true });
      toast.success(field === "stage" ? "Stage updated and farm owners notified" : value === "closed" ? "Opportunity closed to new investments" : "Opportunity is accepting investments");
      refreshInvestments?.();
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Unable to update opportunity" : "Unable to update opportunity");
    } finally { setSaving(null); }
  };
  const selectClass = "w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary/30 disabled:opacity-50";
  const stageSelect = <select aria-label={`Stage for ${investment.title}`} value={investment.stage} disabled={saving !== null} onChange={event => updateField("stage", event.target.value)} className={selectClass}>{!stages.includes(investment.stage) && <option value={investment.stage}>{stageLabel(investment.stage)}</option>}{stages.map(item => <option key={item} value={item}>{stageLabel(item)}</option>)}</select>;
  const statusSelect = <select aria-label={`Status for ${investment.title}`} value={investment.status} disabled={saving !== null} onChange={event => updateField("status", event.target.value)} className={selectClass}>{!["active", "closed"].includes(investment.status) && <option value={investment.status}>{stageLabel(investment.status)}</option>}<option value="active">Active</option><option value="closed">Closed</option></select>;

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
          <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-slate-500">Stage<div className="mt-1">{stageSelect}</div></label><label className="text-xs font-medium text-slate-500">Status<div className="mt-1">{statusSelect}</div></label></div>
        </div>
        {modals}
      </>
    );
  }

  /* ── DESKTOP TABLE ROW ───────────────────────────────────── */
  return (
    <>
      <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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

        <td className="px-3 py-4">{stageSelect}</td>
        <td className="px-3 py-4">{statusSelect}</td>

        <td className="px-3 py-4 text-right font-bold text-slate-900 dark:text-white">
          {investment.ROI}%
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
