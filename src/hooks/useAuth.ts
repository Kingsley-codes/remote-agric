"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Role = "user" | "admin" | "super-admin";

interface AuthenticatedUser {
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePhoto?: string;
  email?: string;
  role: Role;
}

const ROLE_STORAGE_KEY: Record<Role, string> = {
  user: "user",
  admin: "admin",
  "super-admin": "admin",
};

const ME_ENDPOINT: Record<"user" | "admin", string> = {
  user: "/api/user/profile",
  admin: "/api/admin/profile",
};

export function useAuth({ allowedRoles }: { allowedRoles: Role[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
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

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${meEndpoint}`,
          { withCredentials: true },
        );
        const profile = isAdminRoute
          ? response.data?.data
          : response.data?.data?.user;

        if (!profile) throw new Error("Profile response did not include a user");

        // The authenticated endpoint, never local storage, determines the role.
        const role: Role = isAdminRoute ? "admin" : "user";
        const user = { ...profile, profilePhoto: typeof profile.profilePhoto === "string" ? profile.profilePhoto : profile.profilePhoto?.url, role };
        const allowed = rolesRef.current.map((item) => item.toLowerCase());

        if (!allowed.includes(role)) {
          throw new Error("Authenticated account does not have an allowed role");
        }

        for (const key of keysToCheck) localStorage.removeItem(key);
        localStorage.setItem(ROLE_STORAGE_KEY[role], JSON.stringify(user));
        setUser(user);
        setLoading(false);
      } catch {
        // Remove forgeable/stale display data if the server rejects the cookie.
        for (const key of keysToCheck) localStorage.removeItem(key);
        router.replace(redirectPath);
      }
    };

    checkAuth();
    window.addEventListener("profile-updated", checkAuth);
    return () => window.removeEventListener("profile-updated", checkAuth);
  }, [router]);

  return { loading, user };
}
