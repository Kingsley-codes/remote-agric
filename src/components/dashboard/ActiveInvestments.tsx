export default function ActiveInvestments() {
  return (
    <div className="bg-card-light rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">Active Investments</h3>
        <a className="text-sm font-bold text-primary">View All</a>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* You can map this later */}
        <InvestmentItem
          title="Maize Farm - Batch A"
          maturity="Dec 12, 2023"
          amount="$4,500"
          progress={65}
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBoMmtoO__WULK6e_x_HZ44r2aXIxZioRtGIBv4Q8bbsPRp46y7FppaB3SS5OSEb42V7aUjKi8uMSiXrX9ltMFIckRU_8_ocN2CKGoqajahR_FQDzvEQ0OFNSblbHyd1wSd9tcG42K8Gx-sR4I5clr1GynjWfx-JVYJlVoq2fGRC0c_QiNiGAWcMkGOm_iUND-GtWuab9UYotvLRVWFOhq74eQKr-qqN9h99UuvaV0w4wo1uQm0ZrlCD5JtyQkd-8BVWbTrbK8rA5w"
        />
      </div>
    </div>
  );
}

interface ItemProps {
  title: string;
  maturity: string;
  amount: string;
  progress: number;
  image: string;
}

function InvestmentItem({
  title,
  maturity,
  amount,
  progress,
  image,
}: ItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${image})` }}
        />

        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-xs text-gray-500">
            Maturity: {maturity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-1 sm:justify-end">
        <div className="flex flex-col items-end min-w-[80px]">
          <span className="text-sm font-bold">{amount}</span>
          <span className="text-xs text-gray-500">Invested</span>
        </div>

        <div className="hidden sm:flex flex-col w-32 gap-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-primary">Growing</span>
            <span className="text-gray-500">{progress}%</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}