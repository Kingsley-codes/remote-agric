"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Role = "user" | "admin" | "super-admin";

const ROLE_STORAGE_KEY: Record<Role, string> = {
  user: "user",
  admin: "admin",
  "super-admin": "admin",
};

const ME_ENDPOINT: Record<"user" | "admin", string> = {
  user: "/api/auth/profile",
  admin: "/api/admin/auth/profile",
};

export function useAuth({ allowedRoles }: { allowedRoles: Role[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const rolesRef = useRef(allowedRoles);

  useEffect(() => {
    const checkAuth = async () => {
      const isAdminRoute =
        rolesRef.current.includes("super-admin") ||
        rolesRef.current.includes("admin");
      const redirectPath = isAdminRoute ? "/admin/login" : "/login";
      const meEndpoint = ME_ENDPOINT[isAdminRoute ? "admin" : "user"];

      const keysToCheck = [
        ...new Set(rolesRef.current.map((r) => ROLE_STORAGE_KEY[r])),
      ];

      // 1. Try localStorage first
      let parsed =
        keysToCheck
          .map((key) => localStorage.getItem(key))
          .filter(Boolean)
          .map((data) => JSON.parse(data!))
          .find(Boolean) ?? null;

      // 2. localStorage empty — fallback to /me endpoint (handles Google OAuth)
      if (!parsed) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${meEndpoint}`,
            { withCredentials: true },
          );

          if (response.data?.data?.user) {
            const role = (
              response.data.data.user.role ?? (isAdminRoute ? "admin" : "user")
            ).toLowerCase() as Role;
            const user = { ...response.data.data.user, role };
            localStorage.setItem(ROLE_STORAGE_KEY[role], JSON.stringify(user));
            parsed = user;
          }
        } catch {
          // Cookie invalid/expired, fall through to redirect
        }
      }

      if (!parsed) {
        router.replace(redirectPath);
        return;
      }

      const userRole = (parsed?.role ?? "user").toLowerCase() as Role;
      const allowed = rolesRef.current.map((r) => r.toLowerCase());

      if (!allowed.includes(userRole)) {
        router.replace(redirectPath);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  return { loading };
}
