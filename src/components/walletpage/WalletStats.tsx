export default function WalletStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-[#d5e7cf] rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 font-semibold">Total Balance</p>
        <p className="text-3xl font-bold">$12,450.00</p>
        <p className="text-green-500 text-sm">+12% vs last month</p>
      </div>

      <div className="bg-white border border-[#d5e7cf] rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 font-semibold">Active Investments</p>
        <p className="text-3xl font-bold">$8,200.00</p>
        <p className="text-sm text-gray-500">4 Active Cycles</p>
      </div>

      <div className="bg-white border border-[#d5e7cf] rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 font-semibold">Withdrawable Earnings</p>
        <p className="text-3xl font-bold">$2,300.00</p>
        <p className="text-sm text-gray-500">Available now</p>
      </div>
    </div>
  );
}
