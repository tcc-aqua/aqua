"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const description = "An interactive pie chart";

const desktopData = [
  { month: "ativo", desktop: 186, fill: "#f43f5e" },
  { month: "inativo", desktop: 305, fill: "#3b82f6" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop" },
  ativo: { label: "ativo", color: "#f43f5e" },
  inativo: { label: "inativo", color: "#3b82f6" },
};

export default function ChartPieInteractive() {
  const id = "pie-interactive";
  const chartRef = React.useRef(null);
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  );
  const months = React.useMemo(() => desktopData.map((item) => item.month), []);

  // Export CSV
  const exportCSV = () => {
    const headers = ["Mês", "Valor"];
    const rows = desktopData.map(d => [d.month, d.desktop]);
    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF com gráfico
  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // Corrige cores fixas
    desktopData.forEach(d => {
      svg.querySelectorAll(`[fill="${d.fill}"]`).forEach(el => {
        el.setAttribute("fill", d.fill);
      });
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
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / scale + 40, canvas.height / scale + 120],
      });

      // Adiciona título
      pdf.setFontSize(16);
      pdf.text("Pie Chart - Visitors", 20, 20);

      // Adiciona imagem do gráfico
      pdf.addImage(imgData, "PNG", 20, 40, canvas.width / scale, canvas.height / scale);

      // Adiciona legenda
      let yLegend = canvas.height / scale + 60;
      desktopData.forEach(d => {
        pdf.setFillColor(d.fill);
        pdf.rect(20, yLegend - 10, 12, 12, "F");
        pdf.setFontSize(12);
        pdf.text(`${d.month.charAt(0).toUpperCase() + d.month.slice(1)}: ${d.desktop}`, 40, yLegend);
        yLegend += 20;
      });

      // Adiciona tabela de dados
      const tableColumn = ["Mês", "Valor"];
      const tableRows = desktopData.map(d => [d.month, d.desktop]);
      autoTable(pdf, { head: [tableColumn], body: tableRows, startY: yLegend + 20 });

      pdf.save("chart_pie.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row space-y-0 pb-0 justify-between">
        <div className="flex items-center gap-1">
          <CardTitle>Status dos Sensores</CardTitle>
        <div className="mx-auto">
          <Button size="sm" variant="secondary" onClick={exportCSV}>Exportar CSV</Button>
          <Button size="sm" variant="secondary" onClick={exportPDF}>Exportar PDF</Button>
        </div>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-2 h-7 w-[130px] rounded-lg pl-2.5" aria-label="Select a value">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map(key => (
              <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex h-3 w-3 shrink-0 rounded-xs" style={{ backgroundColor: chartConfig[key].color }} />
                  {chartConfig[key].label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent ref={chartRef} className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {desktopData[activeIndex].desktop.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
