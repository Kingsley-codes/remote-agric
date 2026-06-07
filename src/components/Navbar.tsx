"use client";

import Link from "next/link";
import { IoMdMenu } from "react-icons/io";
import { FaUserCircle, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

type NavbarUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<NavbarUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? (JSON.parse(storedUser) as NavbarUser) : null);
    setMounted(true);
  }, []);

  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      setIsDropdownOpen(false);
      router.push("/login");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="w-full border-b border-[#eaf3e7] bg-gray-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center h-full pl-4 gap-2">
          <Link href="/" className="h-full flex items-center">
            <Image
              src="/grow-logo.svg"
              alt="Grow logo"
              width={178}
              height={178}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              className="text-lg hover:text-primary text-gray-800  font-semibold transition-colors"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop auth / user section */}
          {mounted &&
            (!user ? (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex h-10 items-center justify-center rounded-xl bg-primary/10 px-4 text-sm font-bold text-primary border border-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              /* Avatar + Dropdown */
              <div className="hidden md:flex items-center" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User avatar"
                      width={38}
                      height={38}
                      className="rounded-full object-cover ring-2 ring-primary/30"
                    />
                  ) : (
                    <FaUserCircle className="text-[38px] text-primary" />
                  )}
                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <div className="absolute right-6 top-18 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info header */}
                    {user.firstName && (
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-gray-700 truncate mt-0.5">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    )}

                    {/* Menu items */}
                    <div className="py-1.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <FaHome className="text-base text-primary/70" />
                        Dashboard
                      </Link>

                      <div className="my-1.5 border-t border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <FaSignOutAlt className="text-base" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:text-primary transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <span className="text-primary w-10 h-10 font-semibold text-3xl flex items-center justify-center">
                X
              </span>
            ) : (
              <IoMdMenu className="w-10 h-10 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />
          <div className="fixed w-full right-0 top-20 bg-gray-100 shadow-lg z-50 animate-slideIn">
            <div className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  className="py-3 px-4 text-base font-medium text-gray-800 hover:text-primary hover:bg-gray-200 rounded-lg transition-colors"
                  href={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-300">
                {mounted &&
                  (!user ? (
                    <>
                      <Link
                        href="/login"
                        className="flex h-12 items-center justify-center rounded-xl border-primary border bg-primary/10 text-base font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                        onClick={closeMenu}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/signup"
                        className="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Mobile user info */}
                      {user.firstName && (
                        <div className="flex items-center gap-3 px-2 pb-3 border-b border-gray-200">
                          {user?.avatar ? (
                            <Image
                              src={user.avatar}
                              alt="User avatar"
                              width={36}
                              height={36}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="text-3xl text-primary shrink-0" />
                          )}
                          <p className="text-sm font-medium text-gray-600 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary/10 text-base font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <FaHome />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-50 text-base font-semibold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <FaSignOutAlt />
                        Log out
                      </button>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
