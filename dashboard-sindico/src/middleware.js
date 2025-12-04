import { NextResponse } from "next/server";

const protectedPrefixes = [
  "/",              
  "/moradores",
  "/relatorios",
  "/comunicados",
  "/configuracoes",
];

const publicRoutes = [
  "/",        
  "/login",
  "/auth",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const payload = token ? parseJwt(token) : null;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (!token || !payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (payload.role === "sindico") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    if (!token || !payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (payload.role === "sindico") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    "/",
    "/moradores/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
    "/comunicados/:path*",
  ],
};
