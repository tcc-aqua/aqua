"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ExportarTabela from "../Layout/ExportTable/page";

// Configuração de cores
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
};

// URL da API
const API_URL = "http://localhost:3333/api/users/novos-moradores";

export function ChartMeiaLua() {
  const [chartData, setChartData] = useState([{ month: "placeholder", desktop: 0, mobile: 0 }]);
  const [total, setTotal] = useState(0);

useEffect(() => {
  async function loadData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) return console.error("Erro ao buscar dados");

      const data = await response.json(); // se data for apenas 36
      // transforma em array de objeto
      const formattedData = [
        {
          month: "Últimos 6 meses",
          desktop: data, // 36
          mobile: 0
        }
      ];

      setChartData(formattedData);
      setTotal(data); // total igual ao número retornado
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  loadData();
}, []);


  return (
    <Card className="flex flex-col hover:border-sky-400 dark:hover:border-sky-950">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total de Moradores 
          <ExportarTabela data={chartData} fileName="novos_moradores_meia_lua" className="ml-2" />
        </CardTitle>
        <CardDescription className="mt-2">Últimos 6 meses</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full md:-mt-8 max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0} // meia-lua da esquerda para direita
            innerRadius={80}
            outerRadius={130}
            barSize={20} // garante visibilidade
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 4}
                        className="fill-muted-foreground"
                      >
                        Moradores
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>

            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-mobile)"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm md:-mt-27">
        <div className="flex items-center gap-2 font-medium leading-none">
          Crescimento este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total de novos moradores nos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
