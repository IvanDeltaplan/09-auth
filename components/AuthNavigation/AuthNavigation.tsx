"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  return (
    <>
      {/* Profile */}
      {isAuthenticated && (
        <li className={css.navigationItem}>
          <a href="/profile" className={css.navigationLink}>
            Profile
          </a>
        </li>
      )}

      {/* User email + Logout */}
      {isAuthenticated && (
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email ?? "User email"}</p>
          <button
            className={css.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </li>
      )}

      {/* Login */}
      {!isAuthenticated && (
        <li className={css.navigationItem}>
          <a href="/sign-in" className={css.navigationLink}>
            Login
          </a>
        </li>
      )}

      {/* Sign up */}
      {!isAuthenticated && (
        <li className={css.navigationItem}>
          <a href="/sign-up" className={css.navigationLink}>
            Sign up
          </a>
        </li>
      )}
    </>
  );
}
