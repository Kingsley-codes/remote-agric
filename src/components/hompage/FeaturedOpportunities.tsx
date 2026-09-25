"use client";

import { useEffect, useState } from "react";
import OpportunityCard from "../opportunitiesPage/OpportunityCard";
import { ApiResponse, ApiProduce } from "@/lib";
import axios from "axios";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function FeaturedOpportunities() {
  const [opportunities, setOpportunities] = useState<ApiProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/produce`,
      { signal: controller.signal },
    ).then(({ data }) => {
      if (!data.success || !Array.isArray(data.produce)) throw new Error("Unable to load opportunities");
      if (controller.signal.aborted) return;
      setOpportunities(data.produce.slice(0, 3));
    }).catch(() => {
      if (!controller.signal.aborted) setError("We couldn't load opportunities. Please try again.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [revision]);

  const retry = () => {
    setLoading(true);
    setError("");
    setRevision(value => value + 1);
  };

  return (
    <section aria-labelledby="featured-opportunities-heading" className="bg-gray-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 id="featured-opportunities-heading" className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
            Featured Opportunities
          </h2>

          <Link
            className="hidden items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-dark sm:flex"
            href="/opportunities"
          >
            View All Projects <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div aria-busy={loading}>
          {loading ? <div role="status">
            <p className="sr-only">Loading featured opportunities...</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map(index => <div key={index} className="h-96 animate-pulse rounded-2xl bg-gray-200" />)}
            </div>
          </div> : error ? <div role="alert" className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">{error}</p>
            <button type="button" onClick={retry} className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark">Try again</button>
          </div> : opportunities.length === 0 ? <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">New farm opportunities are coming soon. Check back for available farms.</p> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map(opportunity => <OpportunityCard key={opportunity._id} opportunity={opportunity} />)}
          </div>}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-dark" href="/opportunities">
            View All Projects <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
