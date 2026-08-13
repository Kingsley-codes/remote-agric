interface YieldChartProps {
  projectedRoi: number;
  activeProjects: number;
}

export default function YieldChart({ projectedRoi, activeProjects }: YieldChartProps) {
  return (
    <div className="bg-card-light rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg text-gray-700 font-bold">Yield Projection</h3>
          <p className="text-sm text-gray-500">
            Estimated returns from your active farms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl text-gray-700 font-bold">₦{projectedRoi.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="grid min-h-62.5 place-items-center rounded-lg bg-[#f6f8f6] px-6 text-center">
        <div>
          <p className="text-3xl font-bold text-primary">{activeProjects}</p>
          <p className="mt-2 text-sm text-gray-500">active farm{activeProjects === 1 ? "" : "s"} contributing to your projected returns.</p>
        </div>
      </div>
    </div>
  );
}
