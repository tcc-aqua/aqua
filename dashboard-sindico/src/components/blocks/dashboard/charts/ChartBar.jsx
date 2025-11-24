"use client";

import { useEffect, useState, useRef } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import jsPDF from "jspdf";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { api } from "@/lib/api";

export function ChartBarLabel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  const chartConfig = {
    novos: {
      label: "Novos Moradores",
      color: "#4f46e5",
    },
  };

  // Busca dados reais do backend usando api.js
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/dashboard");

        if (!res || res.error) {
          console.error("Erro ao carregar novos moradores:", res?.message);
          setData([]);
          return;
        }

        // Pega apenas os novos moradores
        setData(res.novosMoradores ?? []);
      } catch (err) {
        console.error("Erro inesperado ao carregar novos moradores:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    svg.querySelectorAll("[fill='var(--color-novos)']").forEach(el => {
      el.setAttribute("fill", chartConfig.novos.color);
    });

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      const scale = 3;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / scale + 40, canvas.height / scale + 40],
      });

      pdf.addImage(imgData, "PNG", 20, 20, canvas.width / scale, canvas.height / scale);
      pdf.save("novos-moradores.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novos Moradores</CardTitle>
        <CardDescription>Total registrado mês a mês</CardDescription>
      </CardHeader>

      <CardContent ref={chartRef}>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center text-muted-foreground">
            Carregando gráfico...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="novos"
                fill={chartConfig.novos.color}
                radius={8}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Histórico dos últimos 6 meses
        </div>

        <button
          onClick={exportPDF}
          className="mt-2 px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent/80 transition-all"
        >
          Exportar PDF
        </button>
      </CardFooter>
    </Card>
  );
}
