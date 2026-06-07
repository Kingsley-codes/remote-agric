"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaArrowRight, FaSpinner } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 for personal info, 2 for password
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isCreateAccountDisabled, setIsCreateAccountDisabled] = useState(true);
  const router = useRouter();

  // Validate password strength
  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Check if password meets all requirements
  const isPasswordValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Validate confirm password
  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ) => {
    if (!confirmPassword) return "";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Check if create account button should be disabled
  useEffect(() => {
    if (formStep === 2) {
      const isPasswordValidated = isPasswordValid(formData.password);
      const isConfirmPasswordValid =
        formData.password === formData.confirmPassword;
      const isTermsChecked = formData.terms;
      const isDisabled = !(
        isPasswordValidated &&
        isConfirmPasswordValid &&
        isTermsChecked
      );
      setIsCreateAccountDisabled(isDisabled);
    }
  }, [formData, formStep]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(updatedFormData);

    // Password strength calculation
    if (name === "password") {
      const strength = validatePassword(value);
      setPasswordStrength(strength);

      // Validate confirm password when password changes
      if (formData.confirmPassword) {
        const error = validateConfirmPassword(value, formData.confirmPassword);
        setConfirmPasswordError(error);
      }
    }

    // Validate confirm password when confirm password changes
    if (name === "confirmPassword") {
      const error = validateConfirmPassword(formData.password, value);
      setConfirmPasswordError(error);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep === 1) {
      // Validate first step fields
      if (formData.firstName && formData.lastName && formData.email) {
        setFormStep(2);
      }
    }
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 201 && response.data.status === "success") {
        toast.success(response.data.message || "Registration successful!");

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500); // 1.5 second delay to show the toast
      } else {
        // Handle unexpected response format
        toast.error(
          response.data.message ||
            "Registration completed but with an unexpected response.",
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        if (errorData?.status === "error") {
          toast.error(errorData.message || "Registration failed");
        } else {
          toast.error(errorData?.message || "An unexpected error occurred");
        }
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      id: 1,
      avatar: "jcpvvrcgijhgqyilk4ry",
    },
    {
      id: 2,
      avatar: "twnucpgeribcxhmklriu",
    },
    {
      id: 3,
      avatar: "umkgocfaw9gbxhds2uwg",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50 overflow-hidden">
      <div className="absolute top-2 left-2 md:top-6 md:left-6 z-20">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 lg:text-white hover:text-lime-400 transition-colors font-medium text-sm md:text-base"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CldImage
            src="qny4tdd9zhvjy3yeuklc"
            alt="Sustainable agriculture field"
            fill
            className="object-cover opacity-60"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-12 max-w-xl text-white">
          <div className="mb-6 md:mb-8 flex items-center gap-3">
            <Image
              src="/grow-logo_White_Transparent.svg"
              alt="Grow logo"
              width={178}
              height={178}
            />
          </div>

          <h1 className="text-2xl text-lime-400 md:text-3xl font-semibold leading-tight tracking-tight mb-4 md:mb-6">
            Empowering those who feed the continent <br />
          </h1>

          <p className="text-base md:text-lg text-slate-200 mb-6 md:mb-8 leading-relaxed">
            Partner with thousands of farmers who have ventured into sustainable
            farming and livestock production. Transparency and growth, all
            rooted in nature.
          </p>

          {/* Trust Badge */}
          <div className="mt-6 md:mt-8 flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/10">
            <div className="flex -space-x-2 md:-space-x-3">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="relative w-8 h-8 md:w-10 md:h-10">
                  <CldImage
                    src={testimonial.avatar}
                    alt={`User ${index + 1}`}
                    className="rounded-full w-8 h-8 md:w-10 md:h-10 border-2 border-slate-800 object-cover"
                    width={30}
                    height={30}
                  />
                </div>
              ))}
              <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-800 bg-primary flex items-center justify-center text-white font-bold text-xs">
                +2k
              </div>
            </div>
            <div>
              <div className="flex text-yellow-400 text-xs md:text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="fill-current">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Trusted by farmers nationwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-1 flex-col justify-center max-h-screen p-4 md:p-6">
        <div className="w-full max-w-105 mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6 flex items-center justify-center gap-3">
            <Image
              src="/grow-logo.svg"
              alt="Grow logo"
              width={140}
              height={140}
            />
          </div>

          {/* Form Container with Border */}
          <div className="rounded-2xl border bg-gray-100 border-gray-200 p-6 md:p-8 transition-colors duration-200">
            <div className="w-full max-w-md flex flex-col gap-3">
              {/* Heading */}
              <div className="text-center">
                <h2 className="text-xl text-center md:text-2xl font-semibold text-slate-900 tracking-tight mb-1 md:mb-2">
                  {formStep === 1 ? "Create your account" : "Set your password"}
                </h2>
                <p className="text-xs text-center md:text-sm text-slate-500">
                  {formStep === 1
                    ? "Begin your journey as a bonafide farmer with Agrofund Hub."
                    : "Secure your account with a strong password."}
                </p>
              </div>

              {/* Form Progress Indicator */}
              <div className="flex items-center justify-center mb-1 md:mb-2">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full ${
                      formStep === 1
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-10 md:w-12 h-1 mx-2 ${
                      formStep === 2 ? "bg-primary" : "bg-slate-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full ${
                      formStep === 2
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>

              {formStep === 1 && (
                <>
                  {/* Google Auth */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
                    className="flex w-full items-center justify-center gap-3 rounded-xl hover:cursor-pointer bg-white border border-slate-200 p-3 md:p-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <FcGoogle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Sign up with Google</span>
                  </a>

                  {/* Divider */}
                  <div className="relative flex items-center py-1 md:py-2">
                    <div className="grow border-t border-slate-200" />
                    <span className="shrink-0 mx-3 md:mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Or sign up with email
                    </span>
                    <div className="grow border-t border-slate-200" />
                  </div>
                </>
              )}

              {/* Form */}
              <form
                onSubmit={formStep === 1 ? handleContinue : handleSubmit}
                className="flex flex-col gap-3 md:gap-5"
              >
                {formStep === 1 ? (
                  <>
                    {/* Name Fields - Side by Side */}
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {/* First Name Field */}
                      <div className="flex flex-col gap-1 md:gap-1.5">
                        <label
                          htmlFor="firstName"
                          className="text-xs md:text-sm font-semibold text-slate-700"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-3 md:px-4 text-sm text-slate-900 placeholder-slate-400 transition-all"
                          required
                        />
                      </div>

                      {/* Last Name Field */}
                      <div className="flex flex-col gap-1 md:gap-1.5">
                        <label
                          htmlFor="lastName"
                          className="text-xs md:text-sm font-semibold text-slate-700"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-3 md:px-4 text-sm text-slate-900 placeholder-slate-400 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-1 md:gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs md:text-sm font-semibold text-slate-700"
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
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-3 md:px-4 text-sm text-slate-900 placeholder-slate-400 transition-all"
                        required
                      />
                    </div>

                    {/* Continue Button */}
                    <button
                      type="submit"
                      className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm md:text-base py-3 md:py-3.5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue
                      <FaArrowRight className="text-sm md:text-md" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Password Field */}
                    <div className="flex flex-col gap-1 md:gap-1.5">
                      <label
                        htmlFor="password"
                        className="text-xs md:text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white py-2.5 px-3 md:px-4 text-sm text-slate-900 placeholder-slate-400 transition-all"
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

                      {/* Password Strength Meter */}
                      <div className="flex gap-1 md:gap-1.5 mt-2 md:mt-3 h-1.5 md:h-2">
                        {[...Array(4)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-full w-1/16 rounded-full transition-colors ${
                              index < passwordStrength
                                ? index === 0
                                  ? "bg-red-400"
                                  : index === 1
                                    ? "bg-orange-400"
                                    : index === 2
                                      ? "bg-yellow-400"
                                      : "bg-green-400"
                                : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {!isPasswordValid(formData.password) ? (
                          <span className="text-red-500">
                            Password must contain at least 8 characters, one
                            uppercase letter, one number, and one special
                            character.
                          </span>
                        ) : (
                          "Password meets all requirements ✓"
                        )}
                      </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-1 md:gap-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="text-xs md:text-sm font-semibold text-slate-700"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl bg-slate-100 border ${
                            confirmPasswordError && formData.confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : "border-slate-200 focus:border-primary"
                          } py-2.5 px-3 md:px-4 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all`}
                          required
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                      {confirmPasswordError && (
                        <p className="text-xs text-red-500 mt-1">
                          {confirmPasswordError}
                        </p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-2 md:gap-3 mt-1 md:mt-2">
                      <div className="flex h-5 md:h-6 items-center">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="h-4 w-4 md:h-5 md:w-5 rounded border-slate-300 bg-slate-100 text-green-500"
                          required
                        />
                      </div>
                      <div className="text-xs md:text-sm leading-5 md:leading-6">
                        <label
                          htmlFor="terms"
                          className="text-slate-900 font-medium"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary font-bold hover:text-primary-dark transition-colors"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-primary font-bold hover:text-primary-dark transition-colors"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isCreateAccountDisabled || isLoading}
                      className={`mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-sm md:text-base py-3 md:py-3.5 transition-all shadow-lg ${
                        isCreateAccountDisabled || isLoading
                          ? "bg-green-200 cursor-not-allowed hover:bg-green-300"
                          : "bg-primary hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin text-sm md:text-md" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <FaArrowRight className="text-sm md:text-md" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>

              {/* Login Link and Back Button */}
              <div className="text-center mt-1 md:mt-2">
                {formStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    disabled={isLoading}
                    className="text-xs md:text-sm text-primary hover:text-primary-dark mb-1 md:mb-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back to personal info
                  </button>
                )}
                <p className="text-xs md:text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-semibold hover:text-primary-dark transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
