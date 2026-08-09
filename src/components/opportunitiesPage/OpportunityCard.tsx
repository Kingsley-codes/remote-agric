"use client";

import { ApiProduce } from "@/lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GiGoat, GiDoubleFish, GiGrass } from "react-icons/gi";
import { TbCurrencyNaira } from "react-icons/tb";

interface OpportunityCardProps {
  opportunity: ApiProduce;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const router = useRouter();

  const getTypeColor = (category: string) => {
    const cat = category.trim().toLowerCase();

    switch (cat) {
      case "crops":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
        };
      case "livestock":
        return {
          bg: "bg-orange-100",
          text: "text-red-700",
        };
      case "aquaculture":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.trim().toLowerCase();

    switch (cat) {
      case "crops":
        return <GiGrass className="w-4 h-4" />;
      case "livestock":
        return <GiGoat className="w-4 h-4" />;
      case "aquaculture":
        return <GiDoubleFish className="w-4 h-4" />;
      default:
        return "category";
    }
  };

  const fundedPercentage = (100 - opportunity.remainingPercentage).toFixed(2);

  const colors = getTypeColor(opportunity.category);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-shadow border border-black/5">
      <div className="relative h-48 w-full bg-gray-200">
        <div className="absolute top-3 left-3 z-10 rounded-md bg-white/80 px-2 py-1 text-xs font-bold text-primary backdrop-blur-sm">
          {opportunity.produceName}
        </div>
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{ backgroundImage: `url("${opportunity.image1.url}")` }}
          aria-label={opportunity.image1Alt}
        ></div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`rounded-full ${colors.bg} px-2.5 py-0.5 text-xs font-bold ${colors.text} flex items-center justify-center`}
          >
            {getCategoryIcon(opportunity.category)}
          </span>
          <span className="text-xs font-medium text-gray-600">
            {opportunity.duration} months
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-700">{opportunity.title}</h3>
        <p className="mb-3 text-sm text-gray-500">{opportunity.produceName}</p>

        <div className="grid grid-cols-2 rounded-2xl px-2 gap-4 -mx-3 mb-4 py-3 border-y bg-gray-200 border-dashed border-gray-200">
          <div>
            <p className="text-xs text-text-muted">ROI</p>
            <p className="text-lg font-bold text-primary">
              {opportunity.ROI} %
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Unit Price</p>
            <p className="text-lg font-bold text-gray-700 flex items-center justify-end">
              <span className="text-gray-700 w-4 h-4">
                <TbCurrencyNaira />
              </span>
              {opportunity.price}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="flex justify-between text-xs font-medium text-text-muted">
            <span>{fundedPercentage}% Funded</span>
            <span>{opportunity.remainingUnit} Units Left</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${fundedPercentage}%` }}
            ></div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                router.push(
                  `/checkout?produceId=${opportunity._id}&units=${opportunity.minimumUnit}`,
                );
              }}
              className="flex-1 mt-3 rounded-lg bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
            >
              Own This Farm
            </button>
            <button className="flex-1 mt-3 rounded-lg bg-white border border-primary py-2.5 text-sm font-bold text-gray-700 hover:bg-primary/50 hover:text-primary transition-colors">
              <Link href={`/opportunities/${opportunity._id}`}>Details</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
