// app/components/ConfirmModal.tsx
"use client";

import { IoIosWarning } from "react-icons/io";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      bg: "bg-red-50 dark:bg-red-900/10",
      border: "border-red-100 dark:border-red-800",
      icon: "text-red-500 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/10",
      border: "border-amber-100 dark:border-amber-800",
      icon: "text-amber-500 dark:text-amber-400",
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/10",
      border: "border-blue-100 dark:border-blue-800",
      icon: "text-blue-500 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 ${currentVariant.bg} rounded-t-lg`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${currentVariant.bg}`}>
                  <IoIosWarning className={`h-6 w-6 ${currentVariant.icon}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-4 py-2.5 text-white ${currentVariant.button} rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                  )}
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
