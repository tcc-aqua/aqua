"use client";

import { useState } from "react";
import { Sidebar } from "@/components/modern-side-bar";
export default function LayoutDashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "md:ml-0" : "md:ml-44"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
