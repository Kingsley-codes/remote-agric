"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from "lucide-react";
import { FaArrowRight, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  // Check if form is valid
  useEffect(() => {
    const isValid =
      formData.email.trim() !== "" && formData.password.trim() !== "";
    setIsFormValid(isValid);
  }, [formData.email, formData.password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/auth/login`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200 && response.data.status === "success") {
        toast.success(response.data.message || "Login successful!");

        localStorage.removeItem("user"); // clear any stale user session
        localStorage.setItem(
          "admin",
          JSON.stringify({ ...response.data.data.admin, role: "admin" }),
        );

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        toast.error(response.data.message || "An error occurred during login.");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;

      toast.error(
        err.response?.data?.message || "An error occurred during login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 lg:text-white hover:text-lime-400 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Left Visual Section (Desktop) */}
      <div className="hidden lg:flex bg-slate-900 lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CldImage
            src="zv6wbqyvd3hbxj5a9vnn"
            alt="Sustainable agriculture field"
            fill
            className="object-cover opacity-60"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background-dark/90 via-transparent to-background-dark/30" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full text-white p-8">
          {/* Logo - Moved to top */}
          <div className="absolute top-19 left-12 flex items-center gap-3">
            <Image
              src="/grow-logo_White_Transparent.svg"
              alt="Grow logo"
              width={178}
              height={178}
            />
          </div>

          {/* Centered Content */}
          <div className="max-w-md space-y-6 text-center px-4">
            <blockquote className="text-xl md:text-2xl font-display font-medium leading-relaxed">
              &quot;Investing in agriculture is not just about profit; it&apos;s
              about sustaining the future. Grow Africa makes it seamless.&quot;
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-105 mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 flex items-center justify-center gap-3">
            <Image
              src="/grow-logo.svg"
              alt="Grow logo"
              width={140}
              height={140}
            />
          </div>

          {/* Login Form Container */}
          <div className="bg-gray-100  rounded-2xl border border-gray-200 p-6 md:p-8 transition-colors duration-200">
            {/* Header */}
            <div className="mb-6">
              <h1 className="md:text-2xl text-xl font-semibold text-gray-800 text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center">
                Invest in the future of farming today.
              </p>
            </div>

            {/* Google Login Button */}
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/auth/google`}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border border-slate-200 p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:cursor-pointer transition-colors shadow-sm mb-6"
            >
              <FcGoogle className="w-4 h-4 md:w-5 md:h-5" />
              <span>Continue with Google</span>
            </a>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="grow border-t border-slate-200" />
              <span className="shrink-0 mx-3 md:mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or Login with email
              </span>
              <div className="grow border-t border-slate-200" />
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 md:gap-4"
            >
              {/* Email Field */}
              <div className="flex flex-col gap-1 md:gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-4 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary-dark transition-colors flex items-center gap-1 group"
                >
                  Forgot Password?
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Submit Button with Spinner */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`mt-1 md:mt-2 flex w-full items-center justify-center rounded-xl h-10 md:h-12 px-4 text-base font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFormValid && !isLoading
                    ? "bg-primary hover:bg-primary-dark text-white cursor-pointer"
                    : "bg-slate-300 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
