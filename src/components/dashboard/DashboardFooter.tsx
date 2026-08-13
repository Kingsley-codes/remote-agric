export default function dashboardFooter() {
  return (
    <footer className="w-full shrink-0 border-t border-white/10 bg-primary py-2 text-center text-xs text-gray-100">
      © {new Date().getFullYear()} AgrofundHub. All rights reserved.
    </footer>
  );
}
