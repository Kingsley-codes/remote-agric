const superAdminPages = [
  "/admin/dashboard/farmers",
  "/admin/dashboard/audit-logs",
];

export function canAccessAdminPage(role: string | undefined, pathname: string) {
  if (role === "super-admin") return true;
  if (role !== "admin") return false;
  return !superAdminPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );
}
