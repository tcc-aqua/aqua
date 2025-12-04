"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Droplets,
  Building,
  Siren,
  Headset,
  Megaphone,
  LayoutDashboard,
  House,
  Building2,
  Plus
} from "lucide-react";

import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import Cookies from "js-cookie";

const navigationItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "users", name: "Usuários", icon: Users, href: "/users" },
  { id: "condominios", name: "Condomínios", href: "/condominios", icon: Building2 },
  {
    id: "residencias",
    name: "Residências",
    icon: Plus,
    children: [
      { id: "apartamentos", name: "Apartamentos", href: "/apartamentos", icon: Building },
      { id: "casas", name: "Casas", href: "/casas", icon: House }
    ]
  },
  { id: "sensors", name: "Sensores", icon: Droplets, href: "/sensors" },
  { id: "alerts", name: "Alertas", icon: Siren, href: "/alerts" },
  { id: "comunicados", name: "Comunicados", icon: Megaphone, href: "/comunicados" },
];

export function Sidebar({ className = "", isCollapsed, setIsCollapsed }) {

  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [openResidencias, setOpenResidencias] = useState(false);

  useEffect(() => {
    const residencias = navigationItems.find(i => i.id === "residencias");
    if (residencias && residencias.children.some(sub => sub.href === pathname)) {
      setOpenResidencias(true);
    }
  }, [pathname]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    navigationItems.forEach(item => {
      if (!item.children) router.prefetch(item.href);
    });
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCompact");
    if (saved !== null) setIsCollapsed(saved === "true");

    const handleCollapseEvent = (e) => {
      setIsCollapsed(e.detail);
      localStorage.setItem("sidebarCompact", e.detail);
    };

    window.addEventListener("toggle-sidebar-collapse", handleCollapseEvent);
    return () => {
      window.removeEventListener("toggle-sidebar-collapse", handleCollapseEvent);
    };
  }, [setIsCollapsed]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  async function handleLogout(router) {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Cookies.remove("token");
        router.push("/");
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (err) {
      console.error("Erro de conexão no logout:", err);
    }
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg shadow-md border border-border md:hidden hover:bg-muted transition-all duration-200 "
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-accent/30 backdrop-blur-sm z-30 md:hidden "
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-sidebar  border-sidebar-border z-50 transition-all duration-300 flex flex-col border-r-1
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-26" : "w-56"} md:translate-x-0 overflow-hidden ${className}`}
      >

        <div className="flex items-center justify-between p-2 border-sidebar-border bg-sidebar/60 border-b ">
          {!isCollapsed ? (
            <div className="flex items-center">
              <img src="./logo.svg" className="w-12" />
              {mounted && theme === "dark" ? (
                <img src="./escrita-dark.png" className="w-18.5 ml-4" />
              ) : mounted ? (
                <img src="./escrita.png" className="w-18.5 ml-4" />
              ) : null}
            </div>
          ) : (
            <img src="./logo.svg" className="w-11 mx-auto py-1.5" />
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 rounded-md hover:bg-muted"
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto mt-4 ">
          <ul className="space-y-0.5">
            <TooltipProvider>
              {navigationItems.map(item => {

                if (!item.children) {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  const link = (
                    <Link
                      href={item.href}
                      className={`flex items-center transition-all duration-200 rounded-md
                        ${isCollapsed ? "justify-center p-2.5" : "px-3 py-3.5 space-x-2.5"}
                        ${isActive ? "bg-muted border-r-4 border-accent text-accent" : "text-sidebar-foreground hover:bg-muted hover:text-accent"}`}
                      onClick={() => (window.innerWidth < 768 ? setIsOpen(false) : null)}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span className="text-sm">{item.name}</span>}
                    </Link>
                  );

                  return (
                    <li key={item.id}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        </Tooltip>
                      ) : link}
                    </li>
                  );
                }

                const ParentIcon = item.icon;
                const submenuIsOpen = openResidencias;
                const parentButton = (
                  <button
                    onClick={() => setOpenResidencias(!submenuIsOpen)}
                    className={`flex items-center w-full transition-all rounded-md
      ${isCollapsed ? "justify-center p-2.5" : "px-3 py-3.5 space-x-2.5"}
      text-sidebar-foreground hover:bg-muted hover:text-accent`}
                  >
                    <ParentIcon className="h-5 w-5" />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </button>
                );


                return (
                  <li
                    key={item.id}
                    onMouseEnter={() => setOpenResidencias(true)}
                    onMouseLeave={() => setOpenResidencias(false)}
                  >
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{parentButton}</TooltipTrigger>
                        <TooltipContent side="right">{item.name}</TooltipContent>
                      </Tooltip>
                    ) : (
                      parentButton
                    )}

                    <ul
                      className={`overflow-hidden transition-all duration-300
      ${openResidencias ? "max-h-48" : "max-h-0"}
      ${isCollapsed ? "ml-0" : "ml-6"}`}
                    >
                      {item.children.map(sub => {
                        const SubIcon = sub.icon;
                        const active = pathname === sub.href;

                        const subLink = (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            onClick={() => (window.innerWidth < 768 ? setIsOpen(false) : null)}
                            className={`flex items-center rounded-md mt-1 transition-all duration-200
            ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2 space-x-2"}
            ${active ? "bg-muted border-r-4 border-accent text-accent" : "text-sidebar-foreground hover:bg-muted hover:text-accent"}`}
                          >
                            <SubIcon className="h-4 w-4" />
                            {!isCollapsed && <span className="text-sm">{sub.name}</span>}
                          </Link>
                        );

                        return (
                          <li key={sub.id}>
                            {isCollapsed ? (
                              <Tooltip>
                                <TooltipTrigger asChild>{subLink}</TooltipTrigger>
                                <TooltipContent side="right">{sub.name}</TooltipContent>
                              </Tooltip>
                            ) : (
                              subLink
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                );
              })}
            </TooltipProvider>
          </ul>
        </nav>


        <div className="p-3 border-t border-sidebar-border ">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    className="flex items-center justify-center p-2.5 rounded-md hover:bg-muted hover:text-accent "
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Configurações</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              href="/settings"
              className="flex items-center px-3 py-2.5 space-x-2.5 rounded-md hover:bg-muted hover:text-accent"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </Link>
          )}
        </div>


        <div className="p-3 border-t border-sidebar-border mt-auto">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleLogout(router)}
                    className="flex items-center justify-center p-2.5 rounded-md text-destructive cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 ml-5" />
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  className=" text-white"
                  side="right"
                >
                  Sair
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              onClick={() => handleLogout(router)}
              className="flex items-center px-3 py-2.5 space-x-2.5 w-full rounded-md hover:bg-red-200 text-destructive cursor-pointer "
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}



