import { MdSecurity, MdVerifiedUser } from "react-icons/md";

export default function BottomGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
      {/* Security Thresholds */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <MdSecurity size={20} className="text-primary" />
          Security Alert Thresholds
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
            <div>
              <p className="text-sm font-bold text-red-700">
                Large Withdrawal Warning
              </p>
              <p className="text-xs text-red-600/70 font-medium">
                Flag requests over ₦1,000,000
              </p>
            </div>
            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-bold text-slate-700">
                Daily Disbursement Limit
              </p>
              <p className="text-xs text-slate-500 font-medium">
                ₦5,000,000 / ₦10,000,000 (50%)
              </p>
            </div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Safe Processing Protocol */}
      <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col justify-center">
        <div className="text-center">
          <MdVerifiedUser size={40} className="text-primary mx-auto mb-2" />
          <h3 className="text-lg font-black text-slate-900 mb-2">
            Safe Processing Protocol
          </h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            All withdrawals exceeding ₦500,000 require secondary verification
            from a senior admin. Please ensure KYC records are up to date before
            approval.
          </p>
          <button className="mt-4 text-primary font-bold text-sm underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
            View Compliance Guide
          </button>
        </div>
      </div>
    </div>
  );
}
