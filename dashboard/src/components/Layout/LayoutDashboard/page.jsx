"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/modern-side-bar";

export default function LayoutDashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [forceCollapse, setForceCollapse] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const sidebarCollapsed = forceCollapse ? true : isCollapsed;

  return (
    <div className="flex min-h-screen bg-background">
   
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobile={isMobile} 
      />

  
      <main
        className={`flex-1 transition-all duration-300 p-6 
          ${isMobile ? "ml-0" : sidebarCollapsed ? "md:ml-15" : "md:ml-64"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
