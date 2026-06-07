"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

export default function CompleteRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/complete-registration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      // Store user and redirect to dashboard
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto size-14 rounded-full bg-primary/10 flex items-center justify-center">
            <FiLock size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Complete Your Registration</h1>
          <p className="text-sm text-gray-500">
            Your investment is confirmed! Set a password to secure your account
            and access your dashboard.
          </p>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="size-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            "Set Password & Go to Dashboard"
          )}
        </button>

        <p className="text-xs text-center text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
