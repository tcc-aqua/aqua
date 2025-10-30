"use client";

import React, { createContext, useState, useContext } from "react";

// Cria o contexto
const SidebarContext = createContext();

// Provider para envolver o layout/app
export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [forceCollapse, setForceCollapse] = useState(false);

  // Se o switch estiver ativo, a sidebar sempre colapsa
  const sidebarCollapsed = forceCollapse ? true : isCollapsed;

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        forceCollapse,
        setForceCollapse,
        sidebarCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// Hook para usar o contexto
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider");
  }
  return context;
}
