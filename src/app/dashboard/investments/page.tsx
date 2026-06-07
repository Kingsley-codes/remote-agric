"use client";

import { useEffect, useState } from "react";
import InvestmentTable from "@/components/dashboardInvestmentPage/InvestmentTable";
import PageHeader from "@/components/dashboardInvestmentPage/PageHeader";
import StatsSection from "@/components/dashboardInvestmentPage/StatsSection";
import { useAuth } from "@/hooks/useAuth";

interface ProduceImage {
  publicId: string;
  url: string;
}

export interface UserInvestment {
  _id: string;
  orderID: string;
  title: string;
  units: number;
  totalPrice: number;
  duration: number;
  ROI: string;
  status: string;
  stage: string;
  orderStatus: string;
  orderDate: string;
  customerEmail: string;
  payment: { _id: string; amount: number };
  produce: {
    _id: string;
    stage: string;
    image1?: ProduceImage;
    image2?: ProduceImage;
    image3?: ProduceImage;
  };
}

export interface InvestmentDashboardData {
  userInvestments: UserInvestment[];
  totalInvestedAmount: number;
  totalActiveInvestments: number;
  totalProjectedROI: number;
}

export default function InvestmentsPage() {
  const { loading } = useAuth({ allowedRoles: ["user"] });
  const [data, setData] = useState<InvestmentDashboardData | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    const fetchInvestments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard/investments`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch investments");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchInvestments();
  }, [loading]);

  if (loading || fetchLoading) {
    return (
      <div className="flex items-center bg-gray-100 justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-r-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-[#f6f8f6] h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader />
        <StatsSection
          totalInvestedAmount={data?.totalInvestedAmount ?? 0}
          totalActiveInvestments={data?.totalActiveInvestments ?? 0}
          totalProjectedROI={data?.totalProjectedROI ?? 0}
        />
        <InvestmentTable investments={data?.userInvestments ?? []} />
      </div>
    </main>
  );
}
