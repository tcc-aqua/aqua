import { NextResponse } from "next/server";

// Rotas protegidas
const protectedPrefixes = [
  "/dashboard",
  "/sensors",
  "/alerts",
  "/apartamentos",
  "/condominios",
  "/profile",
  "/settings",
  "/users",
  "/suporte",
  "/comunicados"
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Captura o token do cookie
  const token = request.cookies.get("token")?.value;

  // Decodifica o payload do token sem validar assinatura
  const payload = token ? parseJwt(token) : null;

  console.log("payload type:", payload?.type);

  // Verifica se a rota é protegida
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isProtected) {
    // Se não tiver token ou payload → redireciona para login
    if (!token || !payload) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Regras de acesso
    if (payload.type === "superadmin") {
      // Superadmin acessa tudo
      return NextResponse.next();
    } else if (payload.type === "admin") {
      // Admin normal não pode acessar /settings
      if (pathname.startsWith("/settings")) {
        const unauthorizedUrl = new URL("/unauthorized", request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
      return NextResponse.next();
    } else {
      // Qualquer outro tipo não tem acesso
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

// Função auxiliar para decodificar JWT sem validar assinatura
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Configuração estática obrigatória pelo Next.js
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sensors/:path*",
    "/alerts/:path*",
    "/apartamentos/:path*",
    "/condominios/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/suporte/:path*",
    "/comunicados/:path*"
  ],
};
