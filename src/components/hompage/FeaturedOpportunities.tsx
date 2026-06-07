import OpportunityCard from "../opportunitiesPage/OpportunityCard";
import { ApiResponse, ApiProduce } from "@/lib";
import axios from "axios";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

async function getFeaturedOpportunities(): Promise<ApiProduce[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }

  const res = await axios.get<ApiResponse>(
    `${backendUrl}/api/produce?isFeatured=true`,
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

  return res.data.produce;
}

export default async function FeaturedOpportunities() {
  const opportunities = await getFeaturedOpportunities();

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
            Featured Opportunities
          </h2>

          <Link
            className="hidden items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-dark sm:flex"
            href="/opportunities"
          >
            View All Projects <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-dark"
            href="/opportunities"
          >
            View All Projects <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
