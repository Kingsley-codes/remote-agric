import { Breadcrumbs } from "@/components/produceDetails/Breadcrumbs";
import { FAQAccordion } from "@/components/produceDetails/FAQAccordion";
import { HeroGallery } from "@/components/produceDetails/HeroGallery";
import { InvestmentCard } from "@/components/produceDetails/InvestmentCard";
import { NeedHelpCard } from "@/components/produceDetails/NeedHelpCard";
import { StatsPills } from "@/components/produceDetails/StatsPills";
import { ApiProduce } from "@/lib";
import axios from "axios";
import Link from "next/link";

async function getProduce(produceId: string): Promise<ApiProduce | null> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/produce/${produceId}`);
    return response.data.produce;
  } catch {
    return null;
  }
}

export default async function DashboardOpportunityDetailsPage({ params }: { params: Promise<{ produceId: string }> }) {
  const { produceId } = await params;
  const produce = await getProduce(produceId);

  if (!produce) {
    return <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center"><h1 className="text-2xl font-bold text-gray-900">Farm opportunity not found</h1><Link href="/dashboard/opportunities" className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white">Browse opportunities</Link></div>;
  }

  const soldUnits = produce.totalUnit - produce.remainingUnit;
  const fundedPercent = Math.round((soldUnits / produce.totalUnit) * 100);
  const images = [produce.image1.url, produce.image2.url, produce.image3.url].filter(Boolean);
  const roiValue = typeof produce.ROI === "number" ? `+${produce.ROI}%` : produce.ROI;

  return <main className="mx-auto max-w-7xl p-4 py-8 lg:px-8"><div className="grid grid-cols-1 gap-8 lg:grid-cols-12"><div className="flex flex-col gap-6 lg:col-span-8"><Breadcrumbs paths={[{ label: "Dashboard", href: "/dashboard" }, { label: "Opportunities", href: "/dashboard/opportunities" }, { label: produce.title, href: `/dashboard/opportunities/${produceId}` }]} /><div><h1 className="mb-1 text-3xl font-semibold md:text-4xl">{produce.title}</h1><p className="text-sm text-gray-500">{produce.produceName} • {produce.category}</p></div><HeroGallery images={images} /><StatsPills roi={roiValue} duration={produce.duration} category={produce.category} /><section className="mt-4"><h2 className="mb-3 w-47 border-b-2 border-primary text-2xl font-semibold">Project Summary</h2><p className="text-sm leading-relaxed text-gray-600 md:text-base">{produce.description}</p></section><FAQAccordion /></div><aside className="lg:col-span-4"><div className="sticky top-6 flex flex-col gap-4"><InvestmentCard produceId={produce._id} unitPrice={produce.price} fundedPercent={fundedPercent} soldUnits={soldUnits} remainingUnits={produce.remainingUnit} minimumUnit={produce.minimumUnit} /><NeedHelpCard /></div></aside></div></main>;
}
