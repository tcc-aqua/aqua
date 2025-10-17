"use client";
import React, { useState, useEffect } from 'react';
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
  BarChart3,
  FileText,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';
import { ModeToggle } from './layout/DarkMode/page';

const navigationItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/" },
  { id: "analytics", name: "Análises", icon: BarChart3, href: "/analytics" },
  { id: "documents", name: "Documentos", icon: FileText, href: "/documents", badge: "3" },
  { id: "notifications", name: "Notificações", icon: Bell, href: "/notifications", badge: "1" },
  { id: "profile", name: "Perfil", icon: User, href: "/profile" },
  { id: "settings", name: "Configurações", icon: Settings, href: "/settings" },
  { id: "help", name: "Ajuda e Suporte", icon: HelpCircle, href: "/help" },
];

export function Sidebar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        className={`
          fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-999 transition-all duration-300 ease-in-out flex flex-col 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-28" : "w-78"}
          md:translate-x-0 md:static md:z-auto
          overflow-hidden
          ${className}
        `}
      >
        <div className="flex items-center justify-between p-3.5 border-b border-sidebar-border bg-sidebar/60">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-accent-foreground font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-muted-foreground text-base">Aqua</span>
                <span className="text-xs text-muted-foreground">Painel Corporativo</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-10 bg-accent rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-accent-foreground font-bold text-base">A</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-muted transition-all duration-200"
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronLeft className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2  border border-border rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id} className="relative group">
                  <Link
                    href={item.href}
                    className={`
                      w-full flex items-center transition-all duration-200
                      ${isCollapsed ? "justify-center px-2 py-2.5" : "space-x-2.5 px-3 py-2.5"}
                      rounded-md text-left
                      ${isActive ? "bg-muted border-r-4 border-accent text-accent-foreground" : "text-sidebar-foreground hover:text-accent"}
                    `}
                    title={isCollapsed ? item.name : undefined}
                    onClick={() => {
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon className={`h-5 w-5 ${isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent"}`} />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full ">
                        <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>{item.name}</span>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
{/* 
                  {isCollapsed && (
                    <div className="fixed left-[4.5rem] px-2 py-1 bg-accent text-accent-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-500">
                      {item.name}
                      {item.badge && (
                        <span className="ml-1.5 px-1 py-0.5 bg-accent rounded-full text-[10px]">{item.badge}</span>
                      )}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-accent rotate-45" />
                    </div>
                  )} */}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-sidebar-border">
          <div className="p-3">
            <Link
              href="/logout"
              className={`w-full flex items-center rounded-md text-left transition-all duration-200 group text-destructive hover:bg-destructive/10  ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 text-destructive" />
              {!isCollapsed && <span className="text-sm">Sair</span>}
            </Link>

            {isCollapsed && (
              <div className="fixed left-[4.5rem] px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded opacity-0 invisible hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Sair
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-destructive rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
