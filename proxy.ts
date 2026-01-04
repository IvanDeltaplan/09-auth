import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

function matchRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // accessToken есть → авторизован
  if (accessToken) {
    if (matchRoute(pathname, PUBLIC_ROUTES)) {
      const url = req.nextUrl.clone();
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // accessToken нет, refreshToken есть → обновляем сессию
  if (!accessToken && refreshToken) {
    try {
      const sessionUrl = new URL("/api/auth/session", req.url);

      const sessionRes = await fetch(sessionUrl, {
        method: "GET",
        headers: { cookie: req.headers.get("cookie") ?? "" },
        cache: "no-store",
      });

      const setCookie = sessionRes.headers.get("set-cookie");
      const body = await sessionRes.json().catch(() => null);
      const ok = body?.success === true;

      if (ok) {
        // прокидываем обновлённые cookies дальше
        if (matchRoute(pathname, PUBLIC_ROUTES)) {
          const url = req.nextUrl.clone();
          url.pathname = "/profile";
          const res = NextResponse.redirect(url);
          if (setCookie) res.headers.append("set-cookie", setCookie);
          return res;
        }

        const res = NextResponse.next();
        if (setCookie) res.headers.append("set-cookie", setCookie);
        return res;
      }
    } catch {
      // fall through
    }
  }

  // не авторизован → приватные → /sign-in
  if (matchRoute(pathname, PRIVATE_ROUTES)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
