// components/HeroSlideshow.tsx
"use client";

import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaChartLine,
  FaCalendarAlt,
  FaChartBar,
  FaShieldAlt,
  FaUsers,
  FaUserCheck,
  FaBoxOpen,
} from "react-icons/fa";
import { BsTransparency } from "react-icons/bs";
import {IconType} from "react-icons";



// Type definitions
interface ButtonProps {
  text: string;
  primary: boolean;
  icon?: IconType;
}

interface StatProps {
  value: string;
  label: string;
  trend?: string;
}

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string;
  trend?: string;
  percentage?: number;
  subtitle?: string;
  color?: string;
}

interface BadgeProps {
  icon?: IconType;
  text: string;
  color?: string;
  animate?: boolean;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  bgImage: string;
  badge?: BadgeProps;
  stats?: StatProps[];
  buttons?: ButtonProps[];
  monitoringUI?: {
    title: string;
    subtitle: string;
    metrics?: Array<{ label: string; value: string; percentage: number }>;
    status?: string;
  };
  statsCards?: StatCardProps[];
  socialProof?: {
    text: string;
    avatars: string[];
  };
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Grow Africa – Invest in Food. Empower Farmers. Grow Together.",
    subtitle:
      "Grow Africa connects everyday investors to real farming projects across Africa — funding production, supporting farmers, and earning from harvest outcomes.",
    bgImage:
      "https://res.cloudinary.com/dbeyl29fl/image/upload/v1768213215/f3tfcfmz8hotxeekiqlb.png",
    badge: {
      icon: FaShieldAlt,
      text: "Secured & Verified Farm Projects",
      animate: true,
    },
    stats: [
      { value: "5,000+", label: "Active Farmers" },
      { value: "12,000", label: "Hectares Owned" },
      { value: "₦500M", label: "Harvest Returns" },
    ],
    buttons: [
      { text: "Start Investing", primary: true, icon: FaChartLine },
      { text: "Explore Projects", primary: false },
    ],
  },
  {
    id: 2,
    title: "Your Investment Goes Directly to the Farm",
    subtitle:
      "Your funds are used to supply farmers with seeds, fertilizers, equipment and inputs — not cash handouts — ensuring every naira is spent on real production.",
    bgImage:
      "https://res.cloudinary.com/dbeyl29fl/image/upload/v1768213423/mptkzxaetnjot7uhfxlv.png",
    badge: {
      icon: FaUserCheck,
      text: "Ownership Tier",
      animate: true,
    },
    stats: [
      { value: "15,000+", label: "Active Acreage", trend: "+12%" },
      { value: "98.4%", label: "Ops Efficiency", trend: "Real-time" },
    ],
    buttons: [
      { text: "View Available Farms", primary: true, icon: FaChartLine },
    ],
  },
  {
    id: 3,
    title: "Track Every Stage of Your Farm Investment",
    subtitle:
      "From land preparation to planting, crop growth and harvest, Grow Africa keeps you informed at every phase through real-time updates and notifications",
    bgImage:
      "https://res.cloudinary.com/dbeyl29fl/image/upload/v1768213779/mnpfq3idjgfrve9grtyw.png",
    badge: {
      icon: BsTransparency,
      text: "Transparency",
      animate: true,
    },
    statsCards: [
      {
        icon: FaChartBar,
        title: "Growth Progress",
        value: "78%",
        trend: "+12%",
        percentage: 78,
      },
      {
        icon: FaCalendarAlt,
        title: "Next Harvest",
        value: "45 Days",
        subtitle: "Projected: Oct 2026",
      },
    ],
  },
  {
    id: 4,
    title: "Empowering Farmers. Strengthening Communities.",
    subtitle:
      "We work directly with trusted farming communities to remove financial barriers and help farmers focus on what they do best — growing food.",
    bgImage:
      "https://res.cloudinary.com/dbeyl29fl/image/upload/v1768213837/yvapk8gjlpc0lkzhtfk3.png",
    badge: {
      icon: FaUsers,
      text: "Social Impact Driven",
      color: "bg-[#D96C3A]",
      animate: true,
    },
    stats: [
      { value: "200+", label: "Local Producers" },
      { value: "1,000+", label: "Jobs Created" },
      { value: "100%", label: "Local Sourcing" },
    ],
    buttons: [{ text: "Farm With Impact", primary: true }],
  },
  {
    id: 5,
    title: "Harvest Returns, Built on Real Impact",
    subtitle:
      "Structured farming projects with clear timelines, realistic yields, and shared success. We bridge the gap between rural bounty and urban ownership.",
    bgImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaGzTc4uLtjnogTXxRMYZiMn8126RQ5cw4wxWgGiO3WZjtA0u4uuQDiqWpGqKpDVgyrexiroNhUreGqwFgv8pyxMffK_FW05DC592s2ZdY6ya9DeZQPu-htLWi8XNpOaiCIfQuoXQdW51NLcRMxluTXk3qR_QZJ9Q44B6Hx_3tW9GvhBV7jg7UJMc9P4p23YmSDqq6DLQZDJKvYkxExUE45Dc_hY-_8Bsh0gdHyEzRBW-4KZxYFmfInuHN0--4WZ0r9cezs3yY5G7D",
    badge: {
      icon: FaCheckCircle,
      text: "Harvest Season Active",
      color: "bg-[#D96C3A]/90",
      animate: true,
    },
    statsCards: [
      {
        icon: FaChartBar,
        title: "Avg. Yield Increase",
        value: "Up to +35%",
        color: "text-[#1a6b41]",
      },
      {
        icon: FaBoxOpen,
        title: "Bags Harvested",
        value: "10,000+",
        color: "text-[#B89C5C]",
      },
    ],
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(19, 31, 25, 0.9) 0%, rgba(19, 31, 25, 0.4) 50%, rgba(19, 31, 25, 0.1) 100%), url(${slide.bgImage})`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex pt-15">
        <div className="max-w-2xl">
          {/* Badge */}
          {slide.badge && (
            <div
              className={`inline-flex items-center gap-2 ${
                slide.badge.color || "bg-white/10"
              } text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
                slide.badge.animate ? "animate-pulse" : ""
              } backdrop-blur-md border border-white/20`}
            >
              {slide.badge.icon && <slide.badge.icon className="w-4 h-4" />}
              <span>{slide.badge.text}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-white text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-md md:text-lg mb-6 max-w-xl">
            {slide.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {slide.buttons?.map((button, index) => (
              <button
                key={index}
                className={`flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-semibold text-md transition-all ${
                  button.primary
                    ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-[#1a6b41]/30 hover:scale-[1.02]"
                    : "border-2 border-white/20 text-white hover:border-white/40 backdrop-blur-md"
                }`}
              >
                {button.icon && <button.icon className="w-5 h-5" />}
                <span>{button.text}</span>
              </button>
            ))}
          </div>

          {/* Stats Section - Slide 1 */}
          {slide.stats && (
            <div className="flex gap-8 pt-6 border-t border-white/10">
              {slide.stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-white text-xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs uppercase font-bold tracking-widest">
                    {stat.label}
                  </p>
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-[#07882c] text-sm font-bold mt-1">
                      <FaChartLine className="w-4 h-4" />
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Cards - Slide 3 & 5 */}
          {slide.statsCards && (
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              {slide.statsCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-58 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white/70 text-xs font-medium uppercase">
                      {card.title}
                    </p>
                    {card.icon && (
                      <card.icon
                        className={`w-5 h-5 ${card.color || "text-lime-400"}`}
                      />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p
                      className={`text-white text-2xl font-semibold ${
                        card.color || ""
                      }`}
                    >
                      {card.value}
                    </p>
                    {card.trend && (
                      <p className="text-primary text-sm font-bold">
                        {card.trend}
                      </p>
                    )}
                  </div>
                  {card.subtitle && (
                    <p className="text-white/60 text-xs mt-1">
                      {card.subtitle}
                    </p>
                  )}
                  {card.percentage !== undefined && (
                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div
                        className="bg-lime-400 h-full rounded-full"
                        style={{ width: `${card.percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Social Proof - Slide 4 */}
          {slide.socialProof && (
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-3">
                {slide.socialProof.avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-[#131f19] bg-cover bg-center"
                    style={{ backgroundImage: `url(${avatar})` }}
                  ></div>
                ))}
              </div>
              <p className="text-white/80 text-sm font-medium">
                {slide.socialProof.text}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
