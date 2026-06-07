import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 className="text-4xl pb-4 text-gray-800 font-semibold">
          My Investments
        </h2>
        <p className="text-gray-500">Track your farm portfolio performance</p>
      </div>

      <Link href="/opportunities">
        <button className="flex items-center hover:bg-primary-dark gap-2 bg-primary text-gray-100 font-bold px-6 py-3 rounded-xl">
          <FaPlus />
          New Investment
        </button>
      </Link>
    </div>
  );
}
