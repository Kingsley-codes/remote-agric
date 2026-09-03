"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse, ApiProduce } from "@/lib";
import OpportunityCard from "@/components/opportunitiesPage/OpportunityCard";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardOpportunitiesPage() {
  const { loading: authLoading } = useAuth({ allowedRoles: ["user"] });
  const [opportunities, setOpportunities] = useState<ApiProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    axios
      .get<ApiResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/produce`)
      .then((response) => {
        if (!response.data.success) throw new Error("Unable to load opportunities");
        setOpportunities(response.data.produce);
      })
      .catch(() => setError("We couldn't load farm opportunities. Please try again."))
      .finally(() => setLoading(false));
  }, [authLoading]);

  if (authLoading || loading) {
    return <div className="flex h-full items-center justify-center"><div className="size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;
  }

  if (error) {
    return <div className="p-8 text-center"><p className="text-red-600">{error}</p><button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-white">Retry</button></div>;
  }

  return (
    <div className="p-4 md:p-8 lg:px-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 md:text-4xl">Own a New Farm</h1>
        <p className="mt-2 text-gray-500">Explore available farm opportunities and grow your portfolio.</p>
      </header>

      {opportunities.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm"><p className="text-lg text-gray-500">No opportunities are available right now.</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity._id} opportunity={opportunity} detailsHref={`/dashboard/opportunities/${opportunity._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
