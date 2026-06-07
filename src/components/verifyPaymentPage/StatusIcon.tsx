import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

type VerifyStatus = "loading" | "success" | "failed" | "pending";

export default function StatusIcon({ status }: { status: VerifyStatus }) {
  if (status === "success")
    return (
      <div className="relative flex items-center justify-center">
        <span className="absolute size-28 rounded-full bg-emerald-100" />
        <div className="relative size-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
          <FiCheckCircle size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
    );

  if (status === "pending")
    return (
      <div className="relative flex items-center justify-center">
        <span className="absolute size-28 rounded-full bg-amber-100" />
        <div className="relative size-20 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-100">
          <FiClock size={36} className="text-white" strokeWidth={2.5} />
        </div>
      </div>
    );

  return (
    <div className="relative flex items-center justify-center">
      <span className="absolute size-28 rounded-full bg-red-100" />
      <div className="relative size-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-100">
        <FiXCircle size={36} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
}
