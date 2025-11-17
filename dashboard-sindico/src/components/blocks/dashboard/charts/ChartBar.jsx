'use client'

import { useRef } from "react";
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

// Dados do gráfico
const chartData = [
  { month: "Janeiro", novos: 12 },
  { month: "Fevereiro", novos: 18 },
  { month: "Março", novos: 9 },
  { month: "Abril", novos: 15 },
  { month: "Maio", novos: 11 },
  { month: "Junho", novos: 16 },
];

// Configuração do gráfico
const chartConfig = {
  novos: {
    label: "Novos Moradores",
    color: "#4f46e5", // cor direta em hexadecimal
  },
};

export function ChartBarLabel() {
  const chartRef = useRef(null);

  const exportPDF = () => {
    if (!chartRef.current) return;

    // Captura o SVG do gráfico
    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // Garante que cores CSS variáveis sejam aplicadas como hex
    svg.querySelectorAll("[fill='var(--color-novos)']").forEach(el => {
      el.setAttribute("fill", chartConfig.novos.color);
    });

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      const scale = 3; // aumenta resolução para alta qualidade
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
      pdf.save("grafico.pdf");
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
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
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
            <Bar dataKey="novos" fill={chartConfig.novos.color} radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
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
