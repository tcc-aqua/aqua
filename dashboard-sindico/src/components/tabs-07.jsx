"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyChart2 from "./blocks/relatorios/charts/StatusSensores";
import { BarChartIcon } from "lucide-react";
import ChartPieInteractive from "./blocks/relatorios/charts/StatusSensores";
import { ChartTooltipLabelFormatter } from "./blocks/relatorios/charts/UsuariosAtivos";
import { ChartRadarMultiple } from "./blocks/relatorios/charts/ComunicadosEmitidosVsVisualizados";

const tabs = [
  {
    name: "Status Sensores",
    value: "status_sensores",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <ChartPieInteractive />,
  },
  {
    name: "Usuários Ativos",
    value: "usuarios_ativos",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <ChartTooltipLabelFormatter />,
  },
  {
    name: "Comunicados Emitidos x Visualizados",
    value: "dados_gerais",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <ChartRadarMultiple />,
  },
];

export default function TabsIconDemo() {
  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className="p-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <div className="flex items-center gap-1">
              {tab.icon}
              {tab.name}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-4">
          {tab.render}
        </TabsContent>
      ))}
    </Tabs>
  );
}
