import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-white/10 bg-primary px-4 py-3 text-center text-xs text-gray-100">
      <p>© {new Date().getFullYear()} Remote Agric. All rights reserved.</p>
      <p className="mt-1 space-x-3">
        <Link href="/terms" className="hover:text-white">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>
        <Link href="/risk-disclosure" className="hover:text-white">
          Risk Disclosure
        </Link>
      </p>
    </footer>
  );
}
