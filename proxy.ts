import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

function matchRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Не трогаем системные маршруты
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // ❌ Неавторизованный → приватная → /sign-in
  if (!isAuthenticated && matchRoute(pathname, PRIVATE_ROUTES)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // ✅ Авторизованный → публичная → /profile
  if (isAuthenticated && matchRoute(pathname, PUBLIC_ROUTES)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
