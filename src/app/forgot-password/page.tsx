"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send a reset code");
      setStep("reset");
      toast.success("If an account exists, a reset code has been sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send a reset code");
    } finally {
      setLoading(false);
    }
  };

  const reset = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to reset password");
      toast.success("Password reset successfully. Please log in.");
      window.location.assign("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">{step === "request" ? "Reset your password" : "Set a new password"}</h1>
        <p className="mt-2 text-sm text-slate-500">{step === "request" ? "Enter your email and we’ll send a six-digit reset code." : `Enter the code sent to ${email}, then choose a new password.`}</p>
        <form onSubmit={step === "request" ? requestCode : reset} className="mt-6 space-y-4">
          {step === "request" ? (
            <label className="block text-sm font-medium text-slate-700">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-primary" required /></label>
          ) : (
            <>
              <label className="block text-sm font-medium text-slate-700">Verification code<input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-primary" required /></label>
              <label className="block text-sm font-medium text-slate-700">New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-primary" required /></label>
              <label className="block text-sm font-medium text-slate-700">Confirm new password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-primary" required /></label>
            </>
          )}
          <button disabled={loading || (step === "reset" && otp.length !== 6)} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Please wait…" : step === "request" ? "Send reset code" : "Reset password"}</button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-medium text-primary hover:underline">Back to login</Link>
      </section>
    </main>
  );
}
