"use client";

import { useState } from "react";
import { Sidebar } from "@/components/modern-side-bar";

export default function LayoutDashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [forceCollapse, setForceCollapse] = useState(false);

  // Se o switch estiver ativo, isCollapsed é sempre true
  const sidebarCollapsed = forceCollapse ? true : isCollapsed;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          sidebarCollapsed ? "md:ml-0" : "md:ml-44"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
