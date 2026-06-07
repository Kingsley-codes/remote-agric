interface StatsBannerProps {
  totalCount?: number;
}

export default function StatsBanner({ totalCount }: StatsBannerProps) {
  return (
    <div className="bg-linear-to-b from-background-light lg:pl-28 to-white px-4 py-8 lg:px-20 lg:py-10 dark:from-background-dark dark:to-surface-dark">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h1 className="text-3xl font-semibold leading-tight pb-5 tracking-[-0.033em] text-gray-800 sm:text-4xl lg:text-5xl">
              Explore Investment Opportunities in Agriculture
            </h1>

            <p className="text-base font-semibold leading-normal text-gray-600 lg:text-lg">
              Become a remote farmer by owning real agricultural projects,
              monitored and managed on your behalf — while you earn from the
              harvest.
            </p>
          </div>

          <div className="flex gap-6 rounded-2xl bg-primary/10 p-4 backdrop-blur-sm border border-primary/20">
            <div>
              <p className="text-xs font-medium text-gray-800 uppercase tracking-wider">
                Avg ROI
              </p>
              <p className="text-xl font-bold text-center text-primary dark:text-green-400">
                22%
              </p>
            </div>
            <div className="w-px bg-primary/20"></div>
            <div>
              <p className="text-xs font-medium text-gray-800 uppercase tracking-wider">
                Active
              </p>
              <p className="text-xl text-center font-bold text-gray-800">
                {totalCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
