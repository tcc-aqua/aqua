'use client';

import { useEffect, useState, useRef } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import jsPDF from "jspdf";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api"; // seu axios configurado

const chartConfig = {
  ativos: { label: "Ativos", color: "#4f46e5" },   // azul
  inativos: { label: "Inativos", color: "#22c55e" }, // verde
};

export function ChartUsuariosSemana() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/relatorios/usuarios");

        // Exemplo de resposta:
        // { "segunda": {ativos: 2, inativos:0}, ... }

        const data = Object.entries(res).map(([dia, valores]) => ({
          dia,
          ativos: valores.ativos ?? 0,
          inativos: valores.inativos ?? 0,
        }));

        setChartData(data);
      } catch (err) {
        console.error("Erro ao buscar dados de usuários:", err);
        setError("Falha ao carregar dados da semana.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  const exportPDF = () => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

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
      const pdf = new jsPDF({ orientation: "landscape" });
      pdf.addImage(imgData, "PNG", 20, 20, canvas.width / scale, canvas.height / scale);
      pdf.save("usuarios_semana.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportCSV = () => {
    if (!chartData.length) return;
    const csvHeader = "Dia,Ativos,Inativos\n";
    const csvRows = chartData.map(row => `${row.dia},${row.ativos},${row.inativos}`).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "usuarios_semana.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Carregando gráfico...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários por Dia da Semana</CardTitle>
        <CardDescription>Ativos vs Inativos</CardDescription>
      </CardHeader>

      <CardContent ref={chartRef}>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} stackOffset="expand" width={600} height={300}>
            <XAxis dataKey="dia" />
            <Bar dataKey="ativos" stackId="a" fill={chartConfig.ativos.color} />
            <Bar dataKey="inativos" stackId="a" fill={chartConfig.inativos.color} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Dia: ${label}`}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex gap-2 mt-2">
          <Button onClick={exportCSV}>Exportar CSV</Button>
          <Button onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
