'use client'

import { useRef } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

const chartData = [
  { month: "julho", vazamentos: 4, consumo_alto: 12 },
  { month: "agosto", vazamentos: 2, consumo_alto: 9 },
  { month: "setembro", vazamentos: 6, consumo_alto: 14 },
  { month: "outubro", vazamentos: 3, consumo_alto: 10 },
  { month: "Novembro", vazamentos: 3, consumo_alto: 5 },
  { month: "Dezembro", vazamentos: 1, consumo_alto: 1 },
];

const chartConfig = {
  vazamentos: {
    label: "Vazamentos",
    color: "#f43f5e", // vermelho
  },
  consumo_alto: {
    label: "Consumo Alto",
    color: "#3b82f6", // azul
  },
};

export function ChartLineMultiple() {
  const chartRef = useRef(null);

  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll("[stroke='var(--color-vazamentos)']").forEach(el => {
      el.setAttribute("stroke", chartConfig.vazamentos.color);
    });
    svg.querySelectorAll("[stroke='var(--color-consumo_alto)']").forEach(el => {
      el.setAttribute("stroke", chartConfig.consumo_alto.color);
    });

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const scale = 3; // aumenta resolução
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
      pdf.save("grafico_linhas.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vazamentos × Consumo Alto</CardTitle>
        <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
      </CardHeader>

      <CardContent ref={chartRef}>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="vazamentos"
              type="monotone"
              stroke={chartConfig.vazamentos.color}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey="consumo_alto"
              type="monotone"
              stroke={chartConfig.consumo_alto.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Dados dos últimos 6 meses.
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
