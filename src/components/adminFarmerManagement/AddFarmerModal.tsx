"use client";

import { useState, useEffect, useRef } from "react";
import {
  MdClose,
  MdPerson,
  MdLocationOn,
  MdAgriculture,
  MdAttachMoney,
  MdCheckCircle,
  MdTrendingUp,
  MdCloudUpload,
  MdDelete,
  MdPhotoCamera,
} from "react-icons/md";
import { getAllStates, getLGAsForState } from "@/lib/nigerianStatesLGAs";

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FarmerFormData {
  name: string;
  town: string;
  lga: string;
  state: string;
  farmSize: string;
  fundingAmount: string;
  cropsGrown: string[];
  expectedYield: string;
}

const CROP_OPTIONS = [
  "Maize",
  "Rice",
  "Cassava",
  "Yam",
  "Sorghum",
  "Millet",
  "Groundnut",
  "Cowpea",
  "Soybean",
  "Tomato",
  "Pepper",
  "Onion",
  "Cocoa",
  "Palm Oil",
  "Rubber",
  "Cotton",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function AddFarmerModal({
  isOpen,
  onClose,
  onSuccess,
}: AddFarmerModalProps) {
  const [formData, setFormData] = useState<FarmerFormData>({
    name: "",
    town: "",
    lga: "",
    state: "",
    farmSize: "",
    fundingAmount: "",
    cropsGrown: [],
    expectedYield: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropInput, setCropInput] = useState("");
  const [showCropSuggestions, setShowCropSuggestions] = useState(false);
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);

  // Profile photo states
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const states = getAllStates();

  // Update LGAs when state changes
  useEffect(() => {
    if (formData.state) {
      const lgas = getLGAsForState(formData.state);
      setAvailableLGAs(lgas);
      // Reset LGA when state changes
      setFormData((prev) => ({ ...prev, lga: "" }));
    } else {
      setAvailableLGAs([]);
    }
  }, [formData.state]);

  // Filter crop suggestions based on input
  const cropSuggestions = CROP_OPTIONS.filter(
    (crop) =>
      crop.toLowerCase().includes(cropInput.toLowerCase()) &&
      !formData.cropsGrown.includes(crop),
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        town: "",
        lga: "",
        state: "",
        farmSize: "",
        fundingAmount: "",
        cropsGrown: [],
        expectedYield: "",
      });
      setError(null);
      setCropInput("");
      setShowCropSuggestions(false);
      setAvailableLGAs([]);
      // Reset profile photo
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const addCrop = (crop?: string) => {
    const cropToAdd = crop || cropInput.trim();
    if (cropToAdd && !formData.cropsGrown.includes(cropToAdd)) {
      setFormData((prev) => ({
        ...prev,
        cropsGrown: [...prev.cropsGrown, cropToAdd],
      }));
      setCropInput("");
      setShowCropSuggestions(false);
    }
  };

  const removeCrop = (crop: string) => {
    setFormData((prev) => ({
      ...prev,
      cropsGrown: prev.cropsGrown.filter((c) => c !== crop),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Farmer name is required");
      setLoading(false);
      return;
    }
    if (!formData.town.trim()) {
      setError("Town is required");
      setLoading(false);
      return;
    }
    if (!formData.lga) {
      setError("Local Government Area is required");
      setLoading(false);
      return;
    }
    if (!formData.state) {
      setError("State is required");
      setLoading(false);
      return;
    }
    if (!formData.farmSize) {
      setError("Farm size is required");
      setLoading(false);
      return;
    }
    if (formData.cropsGrown.length === 0) {
      setError("At least one crop is required");
      setLoading(false);
      return;
    }
    if (!profilePhoto) {
      setError("Farmer's profile photo is required");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("town", formData.town);
      submitFormData.append("lga", formData.lga);
      submitFormData.append("state", formData.state);
      submitFormData.append("farmSize", formData.farmSize);
      submitFormData.append("fundingAmount", formData.fundingAmount);
      submitFormData.append("expectedYield", formData.expectedYield);
      formData.cropsGrown.forEach((crop) => {
        submitFormData.append("cropsGrown[]", crop);
      });
      submitFormData.append("profilePhoto", profilePhoto);

      const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard/farmers`,
        {
          method: "POST",
          credentials: "include",
          body: submitFormData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Failed to create farmer",
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-linear-to-r from-[#2d4a1e] to-primary px-6 py-4">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <MdPerson className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Farmer</h2>
              <p className="text-white/80 text-sm">
                Register a farmer to the platform
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Profile Photo Upload */}
            <div>
              <h3 className="text-md font-semibold text-[#111b0d] mb-3 flex items-center gap-2">
                <MdPhotoCamera className="text-[#5e9a4c]" />
                Profile Photo <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center gap-4">
                {/* Photo Preview */}
                <div className="relative">
                  {profilePhotoPreview ? (
                    <div className="relative group">
                      <img
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#eaf3e7] border-2 border-dashed border-[#5e9a4c] flex items-center justify-center">
                      <MdPerson className="text-4xl text-[#5e9a4c]" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label
                    htmlFor="profilePhoto"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    <MdCloudUpload className="text-lg" />
                    {profilePhoto ? "Change Photo" : "Upload Photo"}
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    JPEG, PNG or WEBP (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h3 className="text-md font-semibold text-[#111b0d] mb-3 flex items-center gap-2">
                <MdPerson className="text-[#5e9a4c]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g., 5 hectares, 2 acres"
                    className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-md font-semibold text-[#111b0d] mb-3 flex items-center gap-2">
                <MdLocationOn className="text-[#5e9a4c]" />
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                    required
                  >
                    <option value="">
                      {!formData.state ? "Select a state first" : "Select LGA"}
                    </option>
                    {availableLGAs.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town/City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    placeholder="e.g., Ota"
                    className="w-full px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Farming Details */}
            <div>
              <h3 className="text-md font-semibold text-[#111b0d] mb-3 flex items-center gap-2">
                <MdAgriculture className="text-[#5e9a4c]" />
                Farming Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crops Grown <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cropInput}
                        onChange={(e) => {
                          setCropInput(e.target.value);
                          setShowCropSuggestions(true);
                        }}
                        onFocus={() => setShowCropSuggestions(true)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addCrop())
                        }
                        placeholder="Type a crop name..."
                        className="flex-1 px-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => addCrop()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Crop Suggestions Dropdown */}
                    {showCropSuggestions &&
                      cropInput &&
                      cropSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#d5e7cf] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {cropSuggestions.map((crop) => (
                            <button
                              key={crop}
                              type="button"
                              onClick={() => addCrop(crop)}
                              className="w-full text-left px-3 py-2 hover:bg-[#eaf3e7] transition-colors text-sm"
                            >
                              {crop}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Selected Crops */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.cropsGrown.map((crop) => (
                      <span
                        key={crop}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#eaf3e7] text-[#2d4a1e] rounded-lg text-sm"
                      >
                        {crop}
                        <button
                          type="button"
                          onClick={() => removeCrop(crop)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <MdClose className="text-sm" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {formData.cropsGrown.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Add at least one crop
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Yield
                  </label>
                  <div className="relative">
                    <MdTrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e9a4c] text-lg" />
                    <input
                      type="text"
                      name="expectedYield"
                      value={formData.expectedYield}
                      onChange={handleChange}
                      placeholder="e.g., 500 kg, 1000 tons"
                      className="w-full pl-10 pr-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="text-md font-semibold text-[#111b0d] mb-3 flex items-center gap-2">
                <MdAttachMoney className="text-[#5e9a4c]" />
                Financial Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-medium">
                    ₦
                  </span>
                  <input
                    type="number"
                    name="fundingAmount"
                    value={formData.fundingAmount}
                    onChange={handleChange}
                    placeholder="e.g., 500000"
                    className="w-full pl-8 pr-3 py-2 border border-[#d5e7cf] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-[#d5e7cf]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#d5e7cf] text-[#111b0d] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <MdCheckCircle className="text-lg" />
                  Create Farmer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
