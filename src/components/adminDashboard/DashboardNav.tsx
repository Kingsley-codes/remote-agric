import Image from "next/image";
import { GoSidebarCollapse } from "react-icons/go";

interface DashboardNavProps {
  isOpen: boolean;
  onToggle: () => void;
}
export default function AdminDashboardNav({
  isOpen,
  onToggle,
}: DashboardNavProps) {
  return (
    <nav className="w-full border-b md:hidden border-[#eaf3e7] bg-gray-50">
      <div className="w-full flex px-4 gap-3 py-1 items-center">
        {/* Mobile backdrop */}
        {isOpen && (
          <div className="z-40 bg-black/40 md:hidden" onClick={onToggle} />
        )}

        {/* Mobile toggle button — always visible, outside sidebar */}
        {!isOpen && (
          <button
            onClick={onToggle}
            className="z-50 md:hidden p-2 rounded-lg bg-white shadow-md text-primary"
            aria-label="Toggle sidebar"
          >
            <GoSidebarCollapse size={20} />
          </button>
        )}

        <div>
          <Image src="/grow-logo.svg" alt="Grow logo" width={120} height={40} />
        </div>
      </div>
    </nav>
  );
}
