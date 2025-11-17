"use client";
import { useRef } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

export const description = "A radial chart with stacked sections";

const chartData = [{ month: "january", desktop: 1260, mobile: 570 }];
const totalVisitors = chartData[0].desktop + chartData[0].mobile;

const chartConfig = {
  desktop: { label: "Desktop", color: "#4f46e5" }, 
  mobile: { label: "Mobile", color: "#22c55e" },   
};

export default function MyChart5() {
  const chartRef = useRef(null);

  const exportCSV = () => {
    const headers = ["Month", "Desktop", "Mobile"];
    const rows = chartData.map(d => [d.month, d.desktop, d.mobile]);
    const csvContent = "data:text/csv;charset=utf-8," +
      headers.join(",") + "\n" +
      rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "radial_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

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

      pdf.setFontSize(16);
      pdf.text("Radial Chart - Visitors", 20, 20);
      pdf.addImage(imgData, "PNG", 20, 40, canvas.width / scale, canvas.height / scale);

      let yLegend = canvas.height / scale + 60;
      Object.keys(chartConfig).forEach(key => {
        pdf.setFillColor(chartConfig[key].color);
        pdf.rect(20, yLegend - 10, 12, 12, "F");
        pdf.setFontSize(12);
        pdf.text(`${chartConfig[key].label}: ${chartData[0][key]}`, 40, yLegend);
        yLegend += 20;
      });

      const tableColumn = ["Month", "Desktop", "Mobile"];
      const tableRows = chartData.map(d => [d.month, d.desktop, d.mobile]);
      autoTable(pdf, { head: [tableColumn], body: tableRows, startY: yLegend + 20 });

      pdf.save("radial_chart.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 flex justify-between">
        <div>
          <CardTitle className={'text-xl'}>Média de Moradores Por Apartamento</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={exportCSV}>Exportar CSV</Button>
          <Button size="sm" variant="secondary" onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0" ref={chartRef}>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground ">
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar dataKey="desktop" stackId="a" cornerRadius={5} fill={chartConfig.desktop.color} className="stroke-transparent stroke-2" />
            <RadialBar dataKey="mobile" stackId="a" cornerRadius={5} fill={chartConfig.mobile.color} className="stroke-transparent stroke-2" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
