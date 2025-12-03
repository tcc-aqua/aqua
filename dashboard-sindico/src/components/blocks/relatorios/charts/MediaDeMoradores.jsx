'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function MediaMoradoresChart() {
  const [media, setMedia] = useState(0);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await api.get("/relatorios/media-moradores");
        setMedia(res.media_moradores ?? 0);
      } catch (err) {
        console.error("Erro ao buscar média de moradores:", err);
      }
    }
    fetchMedia();
  }, []);

  const chartData = [{ name: "Média de Moradores", value: media }];

  const exportCSV = () => {
    const csvHeader = "Label,Value\n";
    const csvRows = chartData.map(d => `${d.name},${d.value.toFixed(2)}`);
    const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows.join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "media_moradores.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Média de Moradores por Apartamento", 20, 20);

    autoTable(pdf, {
      head: [["Label", "Valor"]],
      body: chartData.map(d => [d.name, d.value.toFixed(2)]),
      startY: 40
    });

    pdf.save("media_moradores.pdf");
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Média de Moradores Por Apartamento</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={exportCSV}>Exportar CSV</Button>
          <Button size="sm" variant="secondary" onClick={exportPDF}>Exportar PDF</Button>
        </div>
      </CardHeader>

      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={true} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5">
              <LabelList dataKey="value" position="top" formatter={(val) => val.toFixed(2)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
