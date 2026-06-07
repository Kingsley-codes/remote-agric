import { FaShieldAlt } from "react-icons/fa";

export default function WalletHeader() {
  return (
    <div className="flex justify-between items-end flex-wrap gap-4">
      <div>
        <h2 className="text-3xl text-gray-800 font-semibold">My Wallet</h2>
        <p className="text-gray-500">
          Manage your funds, track earnings, and withdraw ROI.
        </p>
      </div>

      <div className="flex items-center gap-2 border border-[#d5e7cf] px-3 py-1 rounded-lg bg-white">
        <FaShieldAlt className="text-green-500" />
        <span className="text-sm">Secure Connection</span>
      </div>
    </div>
  );
}
