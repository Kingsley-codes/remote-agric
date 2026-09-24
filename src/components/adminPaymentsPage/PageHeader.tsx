"use client";

export default function PageHeader() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl pb-2 font-semibold tracking-tight text-gray-800">
          Farm Ownership Details
        </h2>
        <p className="text-slate-500 text-sm">
          Monitor and manage Remote Farmer contributions
        </p>
      </div>
    </header>
  );
}
