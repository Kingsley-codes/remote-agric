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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/api/produce/${produceId}`);

    return response.data.produce;
  } catch (error) {
    console.error("Error fetching produce:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    produceId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { produceId } = await params;

  const produce = await getProduce(produceId);

  if (!produce) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Produce Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the produce item you&apos;re looking for.
        </p>
        <Link
          href="/opportunities"
          className="px-6 py-3 bg-primary text-gray-100 font-semibold rounded-xl hover:bg-primary-dark hover:text-white transition-colors"
        >
          Browse Opportunities
        </Link>
      </div>
    );
  }

  // Calculate funded percentage
  const soldUnits = produce.totalUnit - produce.remainingUnit;
  const fundedPercent = Math.round((soldUnits / produce.totalUnit) * 100);

  // Prepare images array for gallery
  const images = [
    produce.image1.url,
    produce.image2.url,
    produce.image3.url,
  ].filter(Boolean); // Remove any empty URLs

  const roiValue =
    typeof produce.ROI === "number" ? `+${produce.ROI}%` : produce.ROI;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Breadcrumbs
              paths={[
                { label: "Home", href: "/" },
                { label: "Opportunities", href: "/opportunities" },
                {
                  label: produce.title,
                  href: `/opportunities/${produceId}`,
                },
              ]}
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-1">
                {produce.title}
              </h1>
              <p className="text-gray-500 text-sm">
                {produce.produceName} • {produce.category}
              </p>
            </div>

            <HeroGallery images={images} />

            <StatsPills
              roi={roiValue}
              duration={produce.duration}
              category={produce.category}
            />

            <div className="mt-4">
              <div className="flex flex-col gap-8">
                {/* Project Summary */}
                <section>
                  <h3 className="text-2xl w-47 font-semibold border-b-2 border-primary mb-3">
                    Project Summary
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {produce.description}
                  </p>
                </section>

                <FAQAccordion />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-4">
              <InvestmentCard
                produceId={produce._id}
                unitPrice={produce.price}
                fundedPercent={fundedPercent}
                soldUnits={soldUnits}
                remainingUnits={produce.remainingUnit}
                minimumUnit={produce.minimumUnit}
              />

              <NeedHelpCard />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
