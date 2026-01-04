import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

function matchRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],

  // ⚠️ Важно: так как serverApi использует axios, proxy должен выполняться в nodejs runtime.
  // Если у тебя Next ругнётся на это поле — скажи, подстрою под твою версию.
  runtime: "nodejs",
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

  // accessToken нет, refreshToken есть → обновляем сессию через serverApi.checkSession
  if (!accessToken && refreshToken) {
    try {
      const cookie = req.headers.get("cookie") ?? "";
      const sessionRes = await checkSession(cookie); // ✅ требование валидатора

      // если бэкенд обновил токены через set-cookie — прокидываем дальше
      const setCookie = sessionRes.headers?.["set-cookie"];
      const ok = sessionRes.data?.success === true;

      if (ok) {
        if (matchRoute(pathname, PUBLIC_ROUTES)) {
          const url = req.nextUrl.clone();
          url.pathname = "/profile";
          const res = NextResponse.redirect(url);

          if (setCookie) {
            const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
            for (const c of arr) res.headers.append("set-cookie", c);
          }
          return res;
        }

        const res = NextResponse.next();
        if (setCookie) {
          const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
          for (const c of arr) res.headers.append("set-cookie", c);
        }
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
