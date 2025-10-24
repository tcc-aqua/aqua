"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  IdCardLanyard,
  Droplets,
  Building,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import { useTheme } from "next-themes";

const navigationItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "sensors", name: "Sensores", icon: Droplets, href: "/sensors" },
  { id: "condominios", name: "Condomínios", icon: Building, href: "/condominios" },
  { id: "users", name: "Usuários", icon: Users, href: "/users" },
  { id: "tecnicos", name: "Técnicos", icon: IdCardLanyard, href: "/funcionarios" },
  { id: "profile", name: "Perfil", icon: User, href: "/profile" },
  { id: "contact", name: "Contato", icon: MessageCircle, href: "/contact" },
  { id: "settings", name: "Configurações", icon: Settings, href: "/settings" },
];

export function Sidebar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);       // mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768); // abre automaticamente em telas maiores
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
   
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-white shadow-md border border-border md:hidden hover:bg-muted transition-all duration-200"
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
        className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-24" : "w-64"}
          md:translate-x-0 overflow-hidden
          ${className}
        `}
      >
     
        <div className="flex items-center justify-between p-3.5 border-b border-sidebar-border bg-sidebar/60">
          {!isCollapsed ? (
            <div className="flex items-center">
              <img src="./logo.svg" alt="logo" className="w-10" />
              {theme === "dark" ? (
                <img src="./escrita-dark.png" alt="aqua" className="w-20 ml-4" />
              ) : (
                <img src="./escrita.png" alt="aqua" className="w-20 ml-4" />
              )}
            </div>
          ) : (
            <img src="./logo.svg" alt="logo" className="w-10 mx-auto" />
          )}

    
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-muted transition-all duration-200"
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto mt-4">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center transition-all duration-200 rounded-md
                      ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5 space-x-2.5"}
                      ${isActive
                        ? "bg-muted border-r-4 border-accent text-accent"
                        : "text-sidebar-foreground hover:text-accent"}
                    `}
                    onClick={() => {
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link
            href="/logout"
            className={`
              flex items-center rounded-md transition-all duration-200 text-destructive hover:bg-destructive/10
              ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5 space-x-2.5"}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm">Sair</span>}
          </Link>
        </div>
      </div>
    </>
  );
}
