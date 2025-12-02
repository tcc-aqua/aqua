"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Importa a função de API
import { api } from "@/lib/api";

export const description = "An interactive pie chart";

const chartConfig = {
  ativos: { label: "Ativos", color: "#f43f5e" }, // Usando #f43f5e para ativos
  inativos: { label: "Inativos", color: "#3b82f6" }, // Usando #3b82f6 para inativos
};

export default function ChartPieInteractive() {
  const id = "pie-interactive";
  const chartRef = React.useRef(null);
  
  // 1. Estado para armazenar os dados do gráfico
  const [sensorData, setSensorData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // 2. Efeito para carregar os dados da API
  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      const result = await api.get("/relatorios/status-sensores");

      if (result && !result.error) {
        // Formata os dados da API para o formato do recharts
        const formattedData = [
          { month: "ativos", desktop: result.ativos, fill: chartConfig.ativos.color },
          { month: "inativos", desktop: result.inativos, fill: chartConfig.inativos.color },
        ];
        setSensorData(formattedData);
      } else {
        setError(result ? result.message : "Erro ao carregar dados.");
        setSensorData([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []); // Array de dependências vazio para rodar apenas no mount

  // 3. Gerencia o estado do item ativo para interatividade
  const [activeMonth, setActiveMonth] = React.useState(chartConfig.ativos.label);

  const dataToDisplay = sensorData.length > 0 ? sensorData : [
    { month: "ativos", desktop: 0, fill: chartConfig.ativos.color },
    { month: "inativos", desktop: 0, fill: chartConfig.inativos.color },
  ];

  const activeIndex = React.useMemo(
    () => dataToDisplay.findIndex((item) => chartConfig[item.month].label === activeMonth),
    [activeMonth, dataToDisplay]
  );
  
  const currentActiveData = dataToDisplay[activeIndex] || dataToDisplay[0];
  
  const months = React.useMemo(() => dataToDisplay.map((item) => item.month), [dataToDisplay]);

  // Se os dados não estão carregados, tenta definir o primeiro item como ativo
  React.useEffect(() => {
    if (dataToDisplay.length > 0 && !activeMonth) {
      setActiveMonth(chartConfig[dataToDisplay[0].month].label);
    }
  }, [dataToDisplay, activeMonth]);

  // Export CSV
  const exportCSV = () => {
    const headers = ["Status", "Quantidade"];
    const rows = dataToDisplay.map(d => [chartConfig[d.month].label, d.desktop]);
    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "status_sensores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF com gráfico
  const exportPDF = () => {
    if (!chartRef.current || dataToDisplay.length === 0) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // Corrige cores fixas
    dataToDisplay.forEach(d => {
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
      pdf.text("Pie Chart - Status dos Sensores", 20, 20);

      // Adiciona imagem do gráfico
      pdf.addImage(imgData, "PNG", 20, 40, canvas.width / scale, canvas.height / scale);

      // Adiciona legenda
      let yLegend = canvas.height / scale + 60;
      dataToDisplay.forEach(d => {
        const label = chartConfig[d.month].label;
        pdf.setFillColor(d.fill);
        pdf.rect(20, yLegend - 10, 12, 12, "F");
        pdf.setFontSize(12);
        pdf.text(`${label}: ${d.desktop}`, 40, yLegend);
        yLegend += 20;
      });

      // Adiciona tabela de dados
      const tableColumn = ["Status", "Quantidade"];
      const tableRows = dataToDisplay.map(d => [chartConfig[d.month].label, d.desktop]);
      autoTable(pdf, { head: [tableColumn], body: tableRows, startY: yLegend + 20 });

      pdf.save("chart_status_sensores.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };


  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader><CardTitle>Status dos Sensores</CardTitle></CardHeader>
        <CardContent className="flex flex-1 justify-center items-center pb-0 h-[300px]">
          <p>Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader><CardTitle>Status dos Sensores</CardTitle></CardHeader>
        <CardContent className="flex flex-1 justify-center items-center pb-0 h-[300px]">
          <p className="text-red-500">Erro ao carregar dados: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row space-y-0 pb-0 justify-between">
        <div className="flex items-center gap-1">
          <CardTitle>Status dos Sensores</CardTitle>
          <div className="mx-auto flex gap-2">
            <Button size="sm" variant="secondary" onClick={exportCSV}>Exportar CSV</Button>
            <Button size="sm" variant="secondary" onClick={exportPDF}>Exportar PDF</Button>
          </div>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-2 h-7 w-[130px] rounded-lg pl-2.5" aria-label="Selecione um status">
            <SelectValue placeholder="Selecione o Status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map(key => (
              <SelectItem key={key} value={chartConfig[key].label} className="rounded-lg [&_span]:flex">
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
              data={dataToDisplay}
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
                          {currentActiveData.desktop.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {currentActiveData.month.charAt(0).toUpperCase() + currentActiveData.month.slice(1)}
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