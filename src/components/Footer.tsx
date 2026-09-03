"use client";

import Link from "next/link";
import Image from "next/image";
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300">
      {/* CTA */}
      <div className="w-full mx-auto text-center border-white/10 text-white border-b pb-16">
        <h2 className="font-semibold text-gray-200 text-2xl md:text-3xl lg:text-4xl pb-7 pt-16 px-4">
          Interested in farming but never had the land, or time?
        </h2>
        <p className="text-gray-200 mb-8 md:text-sm w-1/2 mx-auto">
          Join Remote Agric, own a farm from anywhere, and take part in building
          sustainable food systems through real agricultural production.
        </p>

        <button>
          <Link
            href="/opportunities"
            className="text-xs text-primary md:text-sm font-bold bg-white px-6 py-3 rounded-lg hover:bg-primary hover:text-white hover:border hover:border-white transition-colors"
          >
            Get Started
          </Link>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="md:flex md:justify-between w-full">
          {/* Brand */}
          <div>
            <div className="mb-4 inline-flex items-center rounded-lg bg-white px-3 py-2">
              <Image
                src="/logo.png"
                alt="Grow logo"
                width={1024}
                height={1536}
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="w-1/2">
              <p className="text-gray-200">
                Own the harvest without owning the land. Farm remotely, harvest
                physically, or sell for profit.
              </p>
              <p className=" pt-3">
                <CiMail className="inline-block mr-2 h-5 w-5" />
                <a
                  href="mailto:remoteagric2024@gmail.com"
                  className="text-gray-200 hover:text-white"
                >
                  remoteagric2024@gmail.com
                </a>
              </p>
              <p className="pt-2">
                <IoIosCall className="inline-block mr-2 h-5 w-5" />
                <a
                  href="tel:+2348060779290"
                  className="text-gray-200 hover:text-white"
                >
                  +234 (0) 806 077 9290
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-4">
            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/agri-learn">Blog</Link>
                </li>
                <li>
                  <Link href="/press">Press</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms">Terms of Use</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/risk-disclosure">Risk Disclosure</Link>
                </li>
                <li>
                  <Link href="/cookie-policy">Cookie Policy</Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faqs">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faqs">FAQs</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-gray-200">
          © {new Date().getFullYear()} Remote Agric. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
