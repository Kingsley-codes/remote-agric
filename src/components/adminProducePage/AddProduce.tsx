// components/NewOpportunityModal.tsx
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

interface NewOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewOpportunityModal({
  isOpen,
  onClose,
}: NewOpportunityModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    produceName: "",
    description: "",
    ROI: "",
    price: "", // Changed from costPerUnit to price to match API
    minimumUnit: "",
    totalUnit: "",
    duration: "",
    category: "",
    images: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({ ...formData, images: newImages });
      setError(""); // Clear error if upload successful
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate all required fields
      if (
        !formData.title ||
        !formData.produceName ||
        !formData.description ||
        !formData.ROI ||
        !formData.price ||
        !formData.minimumUnit ||
        !formData.totalUnit ||
        !formData.category ||
        !formData.duration
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("produceName", formData.produceName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("ROI", formData.ROI);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("minimumUnit", formData.minimumUnit);
      formDataToSend.append("totalUnit", formData.totalUnit);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("duration", formData.duration);

      // Validate images
      const validImages = formData.images.filter(Boolean);

      validImages.forEach((image, index) => {
        formDataToSend.append(`image${index + 1}`, image);
      });

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Call API
      const response = await axios.post(
        `${backendUrl}/api/admin/produce`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data;

      if (response.status !== 201) {
        toast.error(
          data.message || "Failed to create produce. Please try again.",
        );
        return; // Stop execution if there's an error
      }

      console.log("Produce created successfully:", data);

      // Reset form
      setFormData({
        title: "",
        produceName: "",
        description: "",
        ROI: "",
        price: "",
        minimumUnit: "",
        totalUnit: "",
        duration: "",
        category: "",
        images: [],
      });

      // Close modal
      onClose();

      // Show success message
      toast.success(data.message || "Produce created successfully!");
    } catch (err: unknown) {
      console.error("Error creating produce:", err);

      // Handle different types of errors
      if (axios.isAxiosError(err)) {
        // Axios error (network error or server responded with error status)
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "An error occurred while creating the produce";

        toast.error(errorMessage);
        setError(errorMessage);
      } else if (err instanceof Error) {
        // Generic JavaScript error
        toast.error(err.message || "An unexpected error occurred");
        setError(err.message || "An unexpected error occurred");
      } else {
        // Unknown error type
        toast.error("An unknown error occurred");
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                New Project
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Create a new project vehicle for remote farmers join
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              disabled={loading}
            >
              <IoIosClose className="h-7 w-7 bg-red-600 text-white rounded-md hover:bg-red-700" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Message - You can keep this or remove it since we're using toast */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., Solar Farm Project"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Produce Name *
                    </label>
                    <input
                      type="text"
                      value={formData.produceName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          produceName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., Cassava"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    rows={10}
                    placeholder="Describe the agricultural project..."
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Investment Details */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Price per Unit (Naira) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., 5000"
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Minimum Units *
                    </label>
                    <input
                      type="number"
                      value={formData.minimumUnit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumUnit: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., 10"
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Total Units *
                    </label>
                    <input
                      type="number"
                      value={formData.totalUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, totalUnit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., 1000"
                      min="1"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Expected ROI (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.ROI}
                      onChange={(e) =>
                        setFormData({ ...formData, ROI: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., 12.5"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Expected return, if you decide we should handle the sale
                      for you
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Project Duration (months)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., 24"
                      min="1"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Select category</option>
                      <option value="crops">Crops</option>
                      <option value="livestock">Livestock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <h3 className="text-lg font-medium pb-7 text-slate-900 dark:text-white mb-4">
                  Upload Images (Exactly 3 images required)
                </h3>
                <div className="flex justify-center gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="flex flex-col items-center">
                      <label className="cursor-pointer">
                        <div className="w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center hover:border-primary dark:hover:border-blue-500 transition-colors">
                          {formData.images[index] ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={URL.createObjectURL(
                                  formData.images[index],
                                )}
                                alt={`Upload ${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newImages = [...formData.images];
                                  newImages.splice(index, 1);
                                  setFormData({
                                    ...formData,
                                    images: newImages,
                                  });
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                disabled={loading}
                              >
                                <IoIosClose className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <MdDriveFolderUpload className="w-12 h-12 font-light text-gray-600" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Upload exactly 3 images to showcase your produce (Max 5MB
                  each)
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border dark:border-slate-600 rounded-lg text-slate-100 bg-red-600 dark:text-slate-300 hover:bg-red-700 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Produce"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
