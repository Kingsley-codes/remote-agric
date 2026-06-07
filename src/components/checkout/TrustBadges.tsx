import { FiShield, FiLock } from "react-icons/fi";

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition py-2">
     
      <div className="flex items-center gap-1 font-bold text-xl text-slate-700 italic">
        Paystack
      </div>

      <div className="flex items-center gap-1 font-bold text-xl text-slate-700">
        <FiLock /> TLS 256-bit
      </div>
    </div>
  );
}
