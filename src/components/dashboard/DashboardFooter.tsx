export default function dashboardFooter() {
  return (
    <footer className="border-t border-white/10 bg-primary py-2 w-full text-center text-xs text-gray-100">
      © {new Date().getFullYear()} AgrofundHub. All rights reserved.
    </footer>
  );
}
