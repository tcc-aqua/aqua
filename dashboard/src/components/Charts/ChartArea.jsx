"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportarTabela from "../Layout/ExportTable/page";

const API_URL = "http://localhost:3333/api/crescimento";

const chartConfig = {
  total_condominio: {
    label: "Condomínios",
    color: "var(--chart-1)",
  },
  total_casa: {
    label: "Casas",
    color: "var(--chart-2)",
  },
  total_geral: {
    label: "Total Geral",
    color: "var(--chart-3)",
  },
};

export function ChartAreaInteractive() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState("12m");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar dados.");
        const data = await res.json();

        // Garantir que os valores são numéricos
        const parsedData = data.map((item) => ({
          ...item,
          total_casa: Number(item.total_casa),
          total_condominio: Number(item.total_condominio),
          total_geral: Number(item.total_geral),
        }));

        setChartData(parsedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar últimos meses
const filteredData = React.useMemo(() => {
  if (!chartData.length) return [];

  let limit = 12; // padrão: sempre 12 meses

  if (timeRange === "6m") limit = 6;
  if (timeRange === "3m") limit = 3;

  return chartData.slice(-limit);
}, [chartData, timeRange]);

  return (
    <Card className="pt-0 hover:border-sky-400 dark:hover:border-sky-950 transition-colors duration-300">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
           
          <CardTitle>Crescimento de Usuários</CardTitle>
          <CardDescription >
            {loading
              ? "Carregando dados..."
              : `Mostrando os últimos ${
                  timeRange === "3m"
                    ? "3 meses"
                    : timeRange === "6m"
                    ? "6 meses"
                    : "12 meses"
                }`}
                  <div className="flex justify-end text-accent ">
              <ExportarTabela data={filteredData} fileName="crescimento_usuarios" />
             </div>
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecione um período"
          >
            <SelectValue placeholder="Últimos 12 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Últimos 12 meses
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">
            Carregando gráfico...
          </p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            Nenhum dado disponível.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCasa" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCondominio" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-");
                  return new Date(year, month - 1).toLocaleDateString("pt-BR", {
                    month: "short",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(year, month - 1).toLocaleDateString(
                        "pt-BR",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      );
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="total_casa"
                type="natural"
                fill="url(#fillCasa)"
                stroke="var(--chart-2)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="total_condominio"
                type="natural"
                fill="url(#fillCondominio)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="total_geral"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--chart-3)"
                strokeWidth={2.5}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
