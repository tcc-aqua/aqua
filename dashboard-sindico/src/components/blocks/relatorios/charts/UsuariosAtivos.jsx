"use client";

import { useRef } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import jsPDF from "jspdf";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

const chartConfig = {
  running: { label: "Running", color: "#4f46e5" },   // azul
  swimming: { label: "Swimming", color: "#22c55e" }, // verde
};

export function ChartTooltipLabelFormatter() {
  const chartRef = useRef(null);

  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // aplica cores fixas
    svg.querySelectorAll("[fill='var(--color-running)']").forEach(el => {
      el.setAttribute("fill", chartConfig.running.color);
    });
    svg.querySelectorAll("[fill='var(--color-swimming)']").forEach(el => {
      el.setAttribute("fill", chartConfig.swimming.color);
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
      pdf.save("grafico_usuarios_ativos.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportCSV = () => {
    const csvHeader = "Date,Running,Swimming\n";
    const csvRows = chartData.map(row => `${row.date},${row.running},${row.swimming}`).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios_ativos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Ativos</CardTitle>
        <CardDescription>Exportação de gráfico em PDF e CSV.</CardDescription>
      </CardHeader>

      <CardContent ref={chartRef}>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
            />
            <Bar dataKey="running" stackId="a" fill={chartConfig.running.color} radius={[0,0,4,4]} />
            <Bar dataKey="swimming" stackId="a" fill={chartConfig.swimming.color} radius={[4,4,0,0]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                  }
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Dados dos últimos 6 dias.
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={exportCSV}>Exportar CSV</Button>
          <Button onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
