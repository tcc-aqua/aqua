"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyChart1 from "./blocks/relatorios/charts/MyChart1";
import MyChart2 from "./blocks/relatorios/charts/MyChart2";
import { BarChartIcon } from "lucide-react";

const tabs = [
  {
    name: "Vazamento x Consumo Alto",
    value: "vazamentos_consumo",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <MyChart1 />,
  },
  {
    name: "Status Sensores",
    value: "status_sensores",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <MyChart2 />,
  },
  {
    name: "Usuários Ativos",
    value: "usuarios_ativos",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <MyChart2 />,
  },
  {
    name: "Dados Gerais",
    value: "dados_gerais",
    icon: <BarChartIcon className="w-4 h-4" />,
    render: <MyChart2 />,
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
