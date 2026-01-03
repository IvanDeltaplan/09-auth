"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api/api"; // <-- твой axios instance
// или: import { api } from "@/lib/api/api"; (если путь другой)

type Props = {
  children: React.ReactNode;
};

// Подстрой под твои реальные приватные маршруты
const PRIVATE_PREFIXES = ["/notes", "/profile"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const privateRoute = useMemo(() => isPrivatePath(pathname), [pathname]);

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  // чтобы не дергать проверки параллельно
  const inflightRef = useRef<Promise<boolean> | null>(null);

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // ожидается route: app/api/auth/logout
    } catch {
      // даже если упало — все равно скрываем приватный контент
    } finally {
      setIsAuthed(false);
    }
  };

  const checkSession = async (): Promise<boolean> => {
    if (inflightRef.current) return inflightRef.current;

    inflightRef.current = (async () => {
      try {
        // ожидается route: app/api/auth/session (или подставь свой endpoint)
        await api.get("/auth/session");
        setIsAuthed(true);
        return true;
      } catch {
        setIsAuthed(false);
        return false;
      } finally {
        inflightRef.current = null;
      }
    })();

    return inflightRef.current;
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsChecking(true);

      // 1) проверяем сессию при переходе
      const ok = await checkSession();

      if (cancelled) return;

      // 2) если маршрут приватный и не авторизован — делаем logout и НЕ показываем контент
      if (privateRoute && !ok) {
        await logout();
        if (!cancelled) setIsChecking(false);
        return;
      }

      if (!cancelled) setIsChecking(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, privateRoute]);

  // Лоадер во время проверки (всегда)
  if (isChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Если это приватная страница и пользователь не авторизован — контент не показываем
  if (privateRoute && !isAuthed) {
    return null;
  }

  return <>{children}</>;
}
