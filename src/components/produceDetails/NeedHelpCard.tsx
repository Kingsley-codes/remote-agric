"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeadset } from "react-icons/fa";

export function NeedHelpCard() {
  const [supportPath, setSupportPath] = useState<string | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, { credentials: "include", signal: abort.signal })
      .then((response) => { if (!abort.signal.aborted) setSupportPath(response.ok ? "/dashboard/support" : "/contact"); })
      .catch(() => { if (!abort.signal.aborted) setSupportPath("/contact"); });
    return () => abort.abort();
  }, []);
  return (
    <div className="bg-green-50 rounded-xl p-5 border border-green-200 flex items-start gap-4">
      <div className="bg-green-100 p-2 rounded-lg text-green-600">
        <FaHeadset />
      </div>

      <div>
        <h4 className="font-bold text-sm text-gray-900">
          Need help choosing a farm?
        </h4>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          Our farm ownership team is available to guide you.
        </p>
        {supportPath ? <Link
          href={supportPath}
          className="text-xs font-bold text-green-600 hover:underline"
        >
          Chat with Support
        </Link> : <span className="text-xs text-gray-500">Loading support…</span>}
      </div>
    </div>
  );
}
