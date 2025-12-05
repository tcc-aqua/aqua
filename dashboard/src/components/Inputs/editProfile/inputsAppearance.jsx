"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Activity, Layout, Info } from "lucide-react";

export default function InputAppearance() {
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);

    useEffect(() => {
    const stored = localStorage.getItem("enableAnimations");
    if (stored !== null) setEnableAnimations(JSON.parse(stored));
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("showPersonalInfo");
    if (stored !== null) setShowPersonalInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCompact");
    if (saved !== null) {
      setSidebarCompact(saved === "true");
    }
    

    const handleToggle = (e) => {
      setSidebarCompact(e.detail);
    };

    window.addEventListener("toggle-sidebar-collapse", handleToggle);

    return () => {
      window.removeEventListener("toggle-sidebar-collapse", handleToggle);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-2">

      <Card className="shadow-md hover:shadow-lg transition-shadow hover:border-sky-400 dark:hover:border-sky-950 md:h-15">
        <CardContent className="flex justify-between items-center  md:-mt-3">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Layout size={16} /> Sidebar Compacta
            </p>
            <p className="text-xs text-muted-foreground ">
              Barra lateral mais compacta
            </p>
          </div>
          <Switch
            checked={sidebarCompact}
            onCheckedChange={(value) => {
              setSidebarCompact(value);
              localStorage.setItem("sidebarCompact", value);

              window.dispatchEvent(
                new CustomEvent("toggle-sidebar-collapse", { detail: value })
              );
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow hover:border-sky-400 dark:hover:border-sky-950 md:h-15">
        <CardContent className="flex justify-between items-center  md:-mt-3">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Info size={16} /> Informações Pessoais
            </p>
            <p className="text-xs text-muted-foreground">
               Informações pessoais no perfil
            </p>
          </div>
          <Switch
            checked={showPersonalInfo}
            onCheckedChange={(checked) => {
              setShowPersonalInfo(!!checked);
              localStorage.setItem("showPersonalInfo", !!checked);

              window.dispatchEvent(
                new CustomEvent("toggle-personal-info", { detail: !!checked })
              );
            }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow hover:border-sky-400 dark:hover:border-sky-950 md:h-15 ">
        <CardContent className="flex justify-between items-center md:-mt-3">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Activity size={16} /> Animações
            </p>
            <p className="text-xs text-muted-foreground">
              Ative ou desative animações
            </p>
          </div>
          <Switch
            checked={enableAnimations}
            onCheckedChange={(checked) => {
              setEnableAnimations(checked);
              localStorage.setItem("enableAnimations", checked);

              window.dispatchEvent(
                new CustomEvent("toggle-animations", { detail: checked })
              );
            }}
          />
        </CardContent>
      </Card>

    </div>
  );
}
