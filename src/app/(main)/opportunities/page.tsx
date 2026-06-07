"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse, ApiProduce } from "@/lib";
import OpportunityCard from "@/components/opportunitiesPage/OpportunityCard";
import StatsBanner from "@/components/opportunitiesPage/StatsBanner";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<ApiProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        const response = await axios.get<ApiResponse>(
          `${backendUrl}/api/produce`,
        );

        if (response.data.success) {
          setOpportunities(response.data.produce);
          setTotalCount(response.data.count);
        } else {
          setError("Failed to fetch opportunities");
        }
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setError("Error fetching opportunities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="relative flex bg-gray-100 min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="mt-4 text-text-main">Loading opportunities...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-100 flex min-h-screen w-full flex-col overflow-x-hidden">
      <main className="flex-1">
        <StatsBanner totalCount={totalCount} />

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-10">
          {opportunities.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-text-muted">No opportunities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity._id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
