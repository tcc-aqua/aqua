"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Activity, Layout, Info, Sun } from "lucide-react";
import { ModeToggle } from "@/components/Layout/DarkMode/page";

export default function InputAppearance() {
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);

  return (
    <div className="mx-auto max-w-lg  space-y-4">

     

 
      <Card className="shadow-md hover:shadow-lg transition-shadow   hover:border-sky-400 dark:hover:border-sky-700">
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Layout size={16} /> Sidebar Compacta
            </p>
            <p className="text-xs text-muted-foreground">
              Ative para uma barra lateral mais compacta
            </p>
          </div>
          <Switch
            checked={sidebarCompact}
      
          />
        </CardContent>
      </Card>

   
      <Card className="shadow-md hover:shadow-lg transition-shadow  hover:border-sky-400 dark:hover:border-sky-700">
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Info size={16} /> Mostrar Informações Pessoais
            </p>
            <p className="text-xs text-muted-foreground">
              Ative para exibir suas informações pessoais no perfil
            </p>
          </div>
          <Switch
            checked={showPersonalInfo}
            onCheckedChange={(checked) => setShowPersonalInfo(!!checked)}
          />
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow mt-3  hover:border-sky-400 dark:hover:border-sky-700">
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Activity size={16} /> Animações
            </p>
            <p className="text-xs text-muted-foreground">
              Ative ou desative animações na interface
            </p>
          </div>
          <Switch
            checked={enableAnimations}
            onCheckedChange={(checked) => setEnableAnimations(!!checked)}
          />
        </CardContent>
      </Card>

    </div>
  );
}
