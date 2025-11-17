"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Users, FileText } from "lucide-react";
import ChartPieInteractive from "./blocks/relatorios/charts/StatusSensores";
import { ChartTooltipLabelFormatter } from "./blocks/relatorios/charts/UsuariosAtivos";
import { ChartRadarMultiple } from "./blocks/relatorios/charts/ComunicadosEmitidosVsVisualizados";

const tabs = [
  {
    name: "Status Sensores",
    value: "status_sensores",
    icon: <BarChart2 className="w-5 h-5" aria-hidden="true" />,
    render: <ChartPieInteractive />,
  },
  {
    name: "Usuários Ativos",
    value: "usuarios_ativos",
    icon: <Users className="w-5 h-5" aria-hidden="true" />,
    render: <ChartTooltipLabelFormatter />,
  },
  {
    name: "Comunicados Emitidos x Visualizados",
    value: "dados_gerais",
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
    render: <ChartRadarMultiple />,
  },
];

export default function TabsIconDemo() {
  return (
    <section aria-label="Relatórios do sistema" className="w-full">
      <Tabs defaultValue={tabs[0].value} className="w-full">
        <TabsList className="p-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Abrir aba ${tab.name}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="pt-4"
            role="tabpanel"
            aria-labelledby={`tab-${tab.value}`}
          >
            {tab.render}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
