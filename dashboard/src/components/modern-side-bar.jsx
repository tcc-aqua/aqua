"use client";
import React, { useState, useEffect } from 'react';
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
  { id: "dashboard", name: "Painel", icon: Home, href: "/dashboard" },
  { id: "analytics", name: "Análises", icon: BarChart3, href: "/analytics" },
  { id: "documents", name: "Documentos", icon: FileText, href: "/documents", badge: "3" },
  { id: "notifications", name: "Notificações", icon: Bell, href: "/notifications", badge: "12" },
  { id: "profile", name: "Perfil", icon: User, href: "/profile" },
  { id: "settings", name: "Configurações", icon: Settings, href: "/settings" },
  { id: "help", name: "Ajuda e Suporte", icon: HelpCircle, href: "/help" },
];

export function Sidebar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

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
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="Alternar menu lateral"
      >
        {isOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-accent backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-999 transition-all duration-300 ease-in-out flex flex-col 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-28" : "w-78"}
          md:translate-x-0 md:static md:z-auto

          overflow-hidden
          ${className}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-base">Aqua</span>
                <span className="text-xs text-slate-500">Painel Corporativo</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-white font-bold text-base">A</span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200"
            aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 text-slate-500" /> : <ChevronLeft className="h-4 w-4 text-slate-500" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center transition-all duration-200 group text-foreground dark:text-secondary dark:focus:text-accent-foreground hover:scale-99
                      ${isCollapsed ? "justify-center px-2 py-2.5" : "space-x-2.5 px-3 py-2.5"}
                      ${isActive ? "focus:bg-accent focus:text-accent-foreground" : "hover:text-accent"}
                      rounded-md text-left`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon className={`h-5 w-5 ${isActive ? "text-muted" : "text-slate-500 group-hover:text-accent "}`} />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>{item.name}</span>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Tooltip para colapsado */}
                  {isCollapsed && (
                    <div className="fixed left-[4.5rem] px-2 py-1 bg-accent text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && (
                        <span className="ml-1.5 px-1 py-0.5 bg-accent rounded-full text-[10px]">{item.badge}</span>
                      )}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-accent rotate-45" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {/* 
        <div className="mt-auto container mx-auto shadow-md rounded-xl p-2 w-full gap-5 flex items-center justify-center dark:border-1">
          <h1 className="font-bold whitespace-nowrap text-sm">Escolher modo</h1>
          <ModeToggle />
        </div> */}

        <div className="mt-auto border-t border-slate-200">
          <div className={`border-b border-slate-200 bg-slate-50/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-white hover:bg-muted transition-colors duration-200">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-700 font-medium text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-slate-800 truncate">João da Silva</p>
                  <p className="text-xs text-slate-500 truncate">Administrador Sênior</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" title="Online" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-700 font-medium text-sm">JD</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <button
              onClick={() => handleItemClick("logout")}
              className={`w-full flex items-center rounded-md text-left transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"
                }`}
              title={isCollapsed ? "Sair" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-red-600" />
              </div>
              {!isCollapsed && <span className="text-sm">Sair</span>}
            </button>

            {isCollapsed && (
              <div className="fixed left-[4.5rem] px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Sair
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-slate-800 rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out w-full ${isCollapsed ? "md:ml-20" : "md:ml-72"}`}>
        {/* Conteúdo principal aqui */}
      </div>
    </>
  );
}
