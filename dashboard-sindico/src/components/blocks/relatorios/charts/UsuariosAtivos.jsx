'use client';

import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import jsPDF from "jspdf";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api"; 

const chartConfig = {
  ativos: { label: "Ativos", color: "#4f46e5" },   
  inativos: { label: "Inativos", color: "#22c55e" }, 
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

        const data = Object.entries(res).map(([dia, valores]) => ({
          dia,
          ativos: valores.ativosAlterados ?? 0,
          inativos: valores.inativosAlterados ?? 0,
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
      pdf.setFontSize(16);
      pdf.text("Usuários Ativos e Inativos por Dia", 20, 20);
      pdf.addImage(imgData, "PNG", 20, 30, canvas.width / scale, canvas.height / scale);
      pdf.save("usuarios_semana.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) return <p>Carregando gráfico...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários por Dia da Semana</CardTitle>
        <CardDescription>Quantidade absoluta de Ativos vs Inativos</CardDescription>
      </CardHeader>

      <CardContent ref={chartRef} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="dia" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [value, "Usuários"]} />
            <Legend />
            <Bar dataKey="ativos" fill={chartConfig.ativos.color} name={chartConfig.ativos.label}>
              <LabelList dataKey="ativos" position="top" />
            </Bar>
            <Bar dataKey="inativos" fill={chartConfig.inativos.color} name={chartConfig.inativos.label}>
              <LabelList dataKey="inativos" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
