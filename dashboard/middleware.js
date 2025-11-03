import { NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/sensors",
  "/condominios",
  "/apartamento",
  "/profile",
  "/users",
  "/settings",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const perfil = request.cookies.get("perfil")?.value;

  // Verifica se a rota atual é protegida
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isProtected) {
    // Se não tiver token ou perfil, redireciona para o login
    if (!token || !perfil) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Regras adicionais (caso tenha perfis específicos)
    if (pathname.startsWith("/dashboard") && perfil !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Define em quais rotas o middleware vai rodar
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sensors/:path*",
    "/condominios/:path*",
    "/apartamento/:path*",
    "/profile/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
