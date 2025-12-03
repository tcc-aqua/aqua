"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { ModeToggle } from "../DarkMode/page";
import { useAdminProfile } from "@/hooks/useAdminProfile";

import { adminEvent } from "@/components/Listas/Profile";
export default function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const { admin } = useAdminProfile();

  const [imageSrc, setImageSrc] = useState(admin?.image || "./perfilImage/default-avatar.png");

  const [showPersonalInfo, setShowPersonalInfo] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("showPersonalInfo") || "true")
      : true
  );

  useEffect(() => {
    const handler = (e) => {
      setShowPersonalInfo(e.detail);
      localStorage.setItem("showPersonalInfo", JSON.stringify(e.detail));
    };
    window.addEventListener("toggle-personal-info", handler);
    return () => window.removeEventListener("toggle-personal-info", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { id, image } = e.detail;


      if (id === admin.id) {
        setImageSrc(image);
      }
    };

    adminEvent.addEventListener("imageUpdate", handler);
    return () => adminEvent.removeEventListener("imageUpdate", handler);
  }, [admin?.id]);

  useEffect(() => {
    if (admin?.image) {
      setImageSrc(admin.image);
    }
  }, [admin]);


  function maskEmail(email) {
    if (!email || typeof email !== "string") return "*****";

    const [user, domain] = email.split("@");
    if (!domain) return "*****";

    // Mantém primeira e última letra, resto vira *
    const maskedUser =
      user.length <= 2
        ? user[0] + "*".repeat(Math.max(user.length - 1, 1))
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];

    return maskedUser + "@" + domain;
  }

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
    if (pathname.startsWith("/profile")) return "Perfil";
    return "Bem-vindo(a)";
  };

  const titulo = getTituloByPath();

  return (
    <header className="fixed top-0 left-0 w-full h-auto z-50 bg-sidebar backdrop-blur-lg border-b-2 border-b-accent/60 border-border shadow-sm transition-all  ">
      <div className={`flex flex-col sm:flex-row items-center justify-between ${isMobile ? "px-4 py-3 space-y-2" : "px-10 py-4"}`}>
        <div className={`text-center select-none ${isMobile ? "order-1 w-full" : "absolute left-1/2 -translate-x-1/2"}`}>
          <h1 className={`font-semibold tracking-wide bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm ${isMobile ? "text-lg leading-tight" : "text-3xl"}`}>
            {titulo}
          </h1>
          {!isMobile && (
            <p className="text-xs text-muted-foreground/80 mt-1">
              Sistema de gestão e monitoramento
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 ml-auto order-2">
          <ModeToggle />
          <div className="relative">
            <Bell className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
          </div>

          <Link href="/profile" className="flex items-center space-x-3 pl-5 cursor-pointer group">
            <div className="relative">

              <div className="w-10 h-10 rounded-full overflow-hidden border shadow-sm group-hover:scale-105 transition-transform">
                <img src={imageSrc} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div
                className="z-10 absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
                title="Online"
              />
            </div>
            {!isMobile && (
              <div className="leading-tight group-hover:opacity-80 transition-opacity">
                    <p className="text-sm font-semibold text-foreground break-all">
                  {admin?.email
                    ? showPersonalInfo
                      ? admin.email
                      : maskEmail(admin.email)
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {admin?.role || "Admin"}
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
