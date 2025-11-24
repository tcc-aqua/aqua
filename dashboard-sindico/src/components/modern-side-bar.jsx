'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Building,
  Grid,
  HousePlus,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Cookies from "js-cookie";

const navigationItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/" },
  { id: "moradores", name: "Moradores", icon: Users, href: "/moradores" },
  { id: "relatorios", name: "Relatórios", icon: Building, href: "/relatorios" },
  { id: "suporte", name: "Suporte", icon: HousePlus, href: "/suporte" },
  { id: "comunicados", name: "Comunicados", icon: HousePlus, href: "/comunicados" },
];

export function Sidebar({ className = "", isCollapsed, setIsCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => { navigationItems.forEach(item => router.prefetch(item.href)); }, [router]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  async function handleLogout() {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        Cookies.remove("token");
        router.push("/");
      } else console.error("Erro ao fazer logout");
    } catch (err) {
      console.error("Erro de conexão no logout:", err);
    }
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg shadow-md border border-border md:hidden hover:bg-muted transition-all duration-200"
        aria-label="Alternar menu lateral"
      >
        {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-accent/30 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-55"} md:translate-x-0 overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between p-2.5 border-b border-sidebar-border bg-sidebar/60">
          {!isCollapsed ? (
            <div className="flex items-center">
              <img src="./logo.svg" alt="logo" className="w-12" />
              {mounted && theme === "dark" ? (
                <img src="./escrita-dark.png" alt="aqua" className="w-20 ml-4" />
              ) : mounted ? (
                <img src="./escrita.png" alt="aqua" className="w-20 ml-4" />
              ) : null}
            </div>
          ) : (
            <img src="./logo.svg" alt="logo" className="w-12 mx-auto py-1.5" />
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 rounded-md hover:bg-muted transition-all duration-200"
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto mt-4">
          <ul className="space-y-1">
            <TooltipProvider>
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const link = (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center transition-all duration-200 rounded-md
                      ${isCollapsed ? "justify-center p-2.5" : "px-3 py-3.5 space-x-2.5"}
                      ${isActive
                        ? "bg-muted border-r-4 border-accent text-accent"
                        : "text-sidebar-foreground hover:bg-muted hover:text-accent"}
                    `}
                    onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}
                  >
                    <Icon className={`transition-colors duration-200 ${isCollapsed ? "h-6 w-6" : "h-5 w-5"}`} />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </Link>
                );

                return (
                  <li key={item.id}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent
                          sideOffset={5}
                          side="right"
                          className="bg-accent text-white rounded-md px-2 py-1 text-sm shadow-lg"
                        >
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    ) : link}
                  </li>
                );
              })}
            </TooltipProvider>
          </ul>
        </nav>

        <div className="p-3 border-t border-sidebar-border mt-auto">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2.5 text-sidebar-foreground hover:bg-muted hover:text-accent rounded-md transition-all duration-200"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={5}
                  side="right"
                  className="bg-destructive text-white rounded-md px-2 py-1 text-sm shadow-lg"
                >
                  Sair
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center rounded-md px-3 py-2.5 space-x-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
            >
              <LogOut className="h-5 w-5 transition-colors duration-200" />
              <span className="text-sm">Sair</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
