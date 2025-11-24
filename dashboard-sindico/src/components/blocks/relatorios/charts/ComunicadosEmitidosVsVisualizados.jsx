"use client";

import { useRef } from "react";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

export const description = "A radar chart with multiple data";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "#4f46e5" }, // azul
  mobile: { label: "Mobile", color: "#22c55e" },   // verde
};

export function ChartRadarMultiple() {
  const chartRef = useRef(null);

  // Export CSV
  const exportCSV = () => {
    const headers = ["Month", "Desktop", "Mobile"];
    const rows = chartData.map(d => [d.month, d.desktop, d.mobile]);
    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "radar_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // Corrige cores do radar
    svg.querySelectorAll(`[fill='var(--color-desktop)']`).forEach(el => el.setAttribute("fill", chartConfig.desktop.color));
    svg.querySelectorAll(`[fill='var(--color-mobile)']`).forEach(el => el.setAttribute("fill", chartConfig.mobile.color));

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
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / scale + 40, canvas.height / scale + 120],
      });

      // Título
      pdf.setFontSize(16);
      pdf.text("Radar Chart - Desktop vs Mobile", 20, 20);

      // Gráfico
      pdf.addImage(imgData, "PNG", 20, 40, canvas.width / scale, canvas.height / scale);

      // Legenda
      let yLegend = canvas.height / scale + 60;
      Object.keys(chartConfig).forEach(key => {
        pdf.setFillColor(chartConfig[key].color);
        pdf.rect(20, yLegend - 10, 12, 12, "F");
        pdf.setFontSize(12);
        pdf.text(`${chartConfig[key].label}`, 40, yLegend);
        yLegend += 20;
      });

      // Tabela de dados
      const tableColumn = ["Month", "Desktop", "Mobile"];
      const tableRows = chartData.map(d => [d.month, d.desktop, d.mobile]);
      autoTable(pdf, { head: [tableColumn], body: tableRows, startY: yLegend + 20 });

      pdf.save("radar_chart.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card>
      <CardHeader className="items-center pb-4 flex justify-between">
        <div>
          <CardTitle>Comunicados Emitidos x Visualizados</CardTitle>
          <CardDescription>Showing total visitors for the last 6 months</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={exportCSV}>Exportar CSV</Button>
          <Button size="sm" variant="secondary" onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </CardHeader>

      <CardContent className="pb-0" ref={chartRef}>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar dataKey="desktop" fill={chartConfig.desktop.color} fillOpacity={0.6} />
            <Radar dataKey="mobile" fill={chartConfig.mobile.color} />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
