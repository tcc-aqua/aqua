"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ModeToggle } from "../DarkMode/page";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  const [userInfo, setUserInfo] = useState({
    email: "",
    role: "",
    image: "./perfilImage/default-avatar.png",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded.user_id;

      // Buscar dados do admin no backend
      fetch(`${backendURL}/api/admins/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserInfo({
            email: data.email || decoded.email,
            role: data.role || decoded.role || "Admin",
            image: data.image
              ? `${backendURL}/uploads/perfilImage/${data.image}`
              : "./perfilImage/default-avatar.png",
          });
        })
        .catch((err) => console.error("Erro ao buscar admin:", err));
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }, []);

  const getTituloByPath = () => {
    if (pathname.startsWith("/dashboard")) return "Painel Administrativo";
    if (pathname.startsWith("/users")) return "Gerenciamento de Usuários";
    if (pathname.startsWith("/condominios")) return "Gerenciamento de Condomínios";
    if (pathname.startsWith("/suporte")) return "Central de Suporte";
    if (pathname.startsWith("/comunicados")) return "Central de Comunicados";
    if (pathname.startsWith("/settings")) return "Configurações do Sistema";
    if (pathname.startsWith("/apartamentos")) return "Gerenciamento de Apartamentos";
    if (pathname.startsWith("/alerts")) return "Gerenciamento de Alertas";
    if (pathname.startsWith("/casas")) return "Gerenciamento de Casas";
    if (pathname.startsWith("/sensors")) return "Gerenciamento de Sensores";
    if (pathname.startsWith("/configuracoes")) return "Perfil";
    return "Bem-vindo(a)";
  };

  const titulo = getTituloByPath();

  return (
    <header className="fixed top-0 left-0 w-full h-auto z-50 bg-sidebar backdrop-blur-lg border-b border-border shadow-sm transition-all">
      <div
        className={`flex flex-col sm:flex-row items-center justify-between ${
          isMobile ? "px-4 py-3 space-y-2" : "px-10 py-4"
        }`}
      >
        <div
          className={`text-center select-none ${
            isMobile ? "order-1 w-full" : "absolute left-1/2 -translate-x-1/2"
          }`}
        >
          <h1
            className={`font-semibold tracking-wide bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm ${
              isMobile ? "text-lg leading-tight" : "text-3xl"
            }`}
          >
            {titulo}
          </h1>

          {!isMobile && (
            <p className="text-xs text-muted-foreground/80 mt-1">
              Sistema de gestão e monitoramento para síndicos
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 ml-auto order-2">
          <ModeToggle />
    

          <Link
            href="/configuracoes"
            className="flex items-center space-x-3 pl-5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={userInfo.image}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border shadow-sm group-hover:scale-105 transition-transform"
              />
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
                title="Online"
              />
            </div>

            {!isMobile && (
              <div className="leading-tight group-hover:opacity-80 transition-opacity">
                <p className="text-sm font-semibold text-foreground break-all">
                  {userInfo.email}
                </p>
                <p className="text-xs text-muted-foreground/70">{userInfo.role}</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
