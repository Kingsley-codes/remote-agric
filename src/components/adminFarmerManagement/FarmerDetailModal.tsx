"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  MdAgriculture,
  MdAttachMoney,
  MdBadge,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdSave,
  MdTimeline,
  MdCancel,
  MdTrendingUp,
  MdPhotoCamera,
} from "react-icons/md";
import { FormattedFarmer, getFundingStatusBadge } from "./FarmersTable";

// ── Farmer Detail Modal ──────────────────────────────────────────────────────
interface FarmerDetailModalProps {
  farmer: FormattedFarmer | null;
  onClose: () => void;
  onUpdate?: () => void; // Callback to refresh the farmers list
}

type Status = "Active" | "Pending" | "Suspended";

// ── Badge helpers ─────────────────────────────────────────────────────────────
const statusBadge: Record<Status, { wrapper: string; dot: string }> = {
  Active: {
    wrapper: "bg-green-50 text-green-700 border border-green-100",
    dot: "bg-green-500",
  },
  Pending: {
    wrapper: "bg-orange-50 text-orange-700 border border-orange-100",
    dot: "bg-orange-500",
  },
  Suspended: {
    wrapper: "bg-red-50 text-red-700 border border-red-100",
    dot: "bg-red-500",
  },
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function FarmerDetailModal({
  farmer,
  onClose,
  onUpdate,
}: FarmerDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile photo states
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editData, setEditData] = useState({
    farmSize: "",
    fundingAmount: "",
    cropsGrown: [] as string[],
    expextedYield: "",
  });

  if (!farmer) return null;

  const fundingStatusBadge = getFundingStatusBadge(farmer.fundingStatus);

  // Initialize edit data when entering edit mode
  const handleEditClick = () => {
    setEditData({
      farmSize: farmer.farmSize.replace(/[^0-9.]/g, ""), // Extract number from string like "5 hectares"
      fundingAmount: farmer.fundingAmount.replace(/[^0-9.]/g, ""),
      cropsGrown: [...farmer.cropsGrown],
      expextedYield: farmer.expextedYield,
    });
    // Reset profile photo states
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, WEBP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setProfilePhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePhotoPreview(previewUrl);
      setError(null);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
      setProfilePhotoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateProfilePhoto = async () => {
    if (!profilePhoto) return;

    setIsUpdatingPhoto(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);

      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers/${farmer.id}/photo`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to update profile photo",
        );
      }

      // Reset photo states
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      onUpdate?.(); // Refresh the farmers list
      alert("Profile photo updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleCropRemove = (crop: string) => {
    setEditData((prev) => ({
      ...prev,
      cropsGrown: prev.cropsGrown.filter((c) => c !== crop),
    }));
  };

  const handleUpdateFarmer = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        farmSize: parseFloat(editData.farmSize) || 0,
        fundingAmount: parseFloat(editData.fundingAmount) || 0,
        cropsGrown: editData.cropsGrown,
        expextedYield: editData.expextedYield,
      };

      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers/${farmer.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to update farmer",
        );
      }

      setIsEditing(false);
      onUpdate?.(); // Refresh the farmers list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFundingStatus = async (newStatus: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers/${farmer.id}/funding`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ fundingStatus: newStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to update funding status",
        );
      }

      onUpdate?.(); // Refresh the farmers list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkYieldReceived = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers/${farmer.id}/yield`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to mark yield as received",
        );
      }

      onUpdate?.(); // Refresh the farmers list
      alert("Yield marked as received successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarmer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers/${farmer.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to delete farmer",
        );
      }

      onUpdate?.(); // Refresh the farmers list
      onClose(); // Close the modal after deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-linear-to-r from-[#2d4a1e] to-primary px-6 py-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Image
                src={profilePhotoPreview || farmer.avatar}
                alt={farmer.name}
                width={64}
                height={64}
                className="rounded-full border-4 border-white/20 object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label
                    htmlFor="profilePhotoEdit"
                    className="cursor-pointer text-white text-center"
                  >
                    <MdPhotoCamera className="text-2xl" />
                    <span className="text-xs block">Change</span>
                  </label>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="text-white flex-1">
              <h2 className="text-2xl font-bold">{farmer.name}</h2>
              <p className="text-white/80 text-sm font-mono">
                {farmer.farmerID}
              </p>
            </div>
          </div>
        </div>

        {/* Hidden file input for profile photo */}
        <input
          ref={fileInputRef}
          type="file"
          id="profilePhotoEdit"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleProfilePhotoChange}
          className="hidden"
        />

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Profile Photo Update Section (shown when editing) */}
          {isEditing && profilePhoto && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={profilePhotoPreview || ""}
                    alt="New profile preview"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      New photo selected
                    </p>
                    <p className="text-xs text-blue-700">
                      {profilePhoto.name} (
                      {(profilePhoto.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateProfilePhoto}
                    disabled={isUpdatingPhoto}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  >
                    {isUpdatingPhoto ? "Updating..." : "Update Photo"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-2">Delete Farmer</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete {farmer.name}? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteFarmer}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#111b0d] flex items-center gap-2 pb-2 border-b border-[#d5e7cf]">
                <MdPerson className="text-[#5e9a4c]" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="text-gray-800 font-medium">{farmer.name}</p>
                </div>
                {farmer.email && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <MdEmail className="text-xs" /> Email Address
                    </label>
                    <p className="text-gray-800">{farmer.email}</p>
                  </div>
                )}
                {farmer.phone && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <MdPhone className="text-xs" /> Phone Number
                    </label>
                    <p className="text-gray-800">{farmer.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <MdLocationOn className="text-xs" /> Location
                  </label>
                  <p className="text-gray-800">
                    {farmer.town}, {farmer.lga}, {farmer.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Farming Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#111b0d] flex items-center gap-2 pb-2 border-b border-[#d5e7cf]">
                <MdAgriculture className="text-[#5e9a4c]" />
                Farming Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Farm Size (hectares)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.farmSize}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          farmSize: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Enter farm size in hectares"
                      step="0.01"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {farmer.farmSize}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Crops Grown
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editData.cropsGrown.map(
                          (crop: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[#eaf3e7] text-[#2d4a1e] rounded-full text-xs"
                            >
                              {crop}
                              <button
                                type="button"
                                onClick={() => handleCropRemove(crop)}
                                className="hover:text-red-600"
                              >
                                <MdClose className="text-xs" />
                              </button>
                            </span>
                          ),
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Type crop name and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.currentTarget;
                            const newCrop = input.value.trim();
                            if (
                              newCrop &&
                              !editData.cropsGrown.includes(newCrop)
                            ) {
                              setEditData((prev) => ({
                                ...prev,
                                cropsGrown: [...prev.cropsGrown, newCrop],
                              }));
                              input.value = "";
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {farmer.cropsGrown.map((crop: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#eaf3e7] text-[#2d4a1e] rounded-full text-xs"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Expected Yield
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.expextedYield}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          expextedYield: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="e.g., 500 kg, 1000 tons"
                    />
                  ) : (
                    <p className="text-gray-800">{farmer.expextedYield}</p>
                  )}

                  {!isEditing && (
                    <button
                      onClick={handleMarkYieldReceived}
                      disabled={loading}
                      className="w-full mt-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <MdTrendingUp className="text-base" />
                      Mark Yield as Received
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#111b0d] flex items-center gap-2 pb-2 border-b border-[#d5e7cf]">
                <MdAttachMoney className="text-[#5e9a4c]" />
                Financial Status
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Funding Amount (₦)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.fundingAmount}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          fundingAmount: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Enter funding amount"
                      step="1000"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-[#2d4a1e]">
                      {farmer.fundingAmount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Funding Status
                  </label>
                  <div className="mt-1 flex gap-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${fundingStatusBadge.className}`}
                    >
                      {fundingStatusBadge.label}
                    </span>
                    {!isEditing && (
                      <select
                        onChange={(e) =>
                          handleUpdateFundingStatus(parseInt(e.target.value))
                        }
                        disabled={loading}
                        className="px-2 py-1 text-xs border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Change Status
                        </option>
                        <option value="0">Pending</option>
                        <option value="1">Partially Funded</option>
                        <option value="2">Fully Funded</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#111b0d] flex items-center gap-2 pb-2 border-b border-[#d5e7cf]">
                <MdBadge className="text-[#5e9a4c]" />
                Account Status
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Account Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[farmer.status].wrapper}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${statusBadge[farmer.status].dot}`}
                      />
                      {farmer.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <MdTimeline className="text-xs" /> Joined Date
                  </label>
                  <p className="text-gray-800">
                    {farmer.joinedDate} at {farmer.joinedTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#d5e7cf] flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-[#d5e7cf] text-[#111b0d] rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
              >
                <MdCancel className="text-base" />
                Cancel
              </button>
              <button
                onClick={handleUpdateFarmer}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdSave className="text-base" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
              >
                <MdEdit className="text-base" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <MdDelete className="text-base" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
