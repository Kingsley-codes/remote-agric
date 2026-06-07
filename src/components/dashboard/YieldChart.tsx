export default function YieldChart() {
  return (
    <div className="bg-card-light rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg text-gray-700 font-bold">Yield Projection</h3>
          <p className="text-sm text-gray-500">
            Estimated earnings over next 6 months
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl text-gray-700 font-bold">$14,250</span>
          <span className="text-sm font-bold text-[#078821] bg-[#eaf3e7] px-2 py-0.5 rounded">
            +15%
          </span>
        </div>
      </div>

      {/* Your SVG exactly reused */}
      <div className="relative w-full h-62.5 overflow-hidden">
        {/* paste your svg here unchanged */}
      </div>

      <div className="flex justify-between text-xs font-bold text-gray-400 mt-4 px-2">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
}
