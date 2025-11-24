'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, MapPin, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "@/lib/api"; 

export default function AlertasRecentes() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlertas() {
      setLoading(true);
      try {
        const data = await api.get("/dashboard");
        if (data?.alertasRecentes) {
          setAlertas(data.alertasRecentes.map(a => ({
            id: a.id,
            usuario: a.usuario?.name || "Desconhecido",
            residencia_type: a.residencia_type,
            residencia_logradouro: a.apartamento?.bloco || a.residencia_logradouro,
            residencia_numero: a.apartamento?.numero || a.residencia_numero,
            bairro: a.bairro,
            cidade: a.cidade,
            uf: a.uf,
            tipo: a.tipo,
            nivel: a.nivel,
            status: a.status,
            data: a.criado_em,
          })));
        }
      } catch (err) {
        console.error("Erro ao carregar alertas recentes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlertas();
  }, []);

  const exportCSV = () => {
    const headers = ["Usuário", "Residência", "Tipo", "Status", "Data"];
    const rows = alertas.map(a => [
      a.usuario,
      a.residencia_type === "casa"
        ? `${a.residencia_logradouro}, ${a.residencia_numero}`
        : `Bloco ${a.residencia_logradouro}, ${a.residencia_numero}`,
      a.tipo.replace("_", " "),
      a.status,
      a.data
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alertas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableColumn = ["Usuário", "Residência", "Tipo", "Status", "Data"];
    const tableRows = alertas.map(a => [
      a.usuario,
      a.residencia_type === "casa"
        ? `${a.residencia_logradouro}, ${a.residencia_numero}`
        : `Bloco ${a.residencia_logradouro}, ${a.residencia_numero}`,
      a.tipo.replace("_", " "),
      a.status,
      a.data
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 },
    });

    doc.save("alertas.pdf");
  };

  return (
    <Card className="mx-auto mt-10 hover:border-sky-400 dark:hover:border-sky-950">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Últimos Alertas</CardTitle>
          <div className="ml-auto gap-3">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 bg-accent mx-2 text-white rounded-md hover:bg-accent/80 transition-all"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportPDF}
              className="px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent/80 transition-all"
            >
              Exportar PDF
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <p>Carregando alertas...</p>
        ) : alertas.length === 0 ? (
          <p>Nenhum alerta encontrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Usuário</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Residência</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Data</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {alertas.slice(0, 5).map((alerta) => (
                <tr key={alerta.id} className="hover:bg-muted/10 text-foreground">
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-sky-600 mt-1" />
                      <span className="text-sm font-semibold">{alerta.usuario}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-sky-600 mt-1" />
                      <div>
                        {alerta.residencia_type === "casa" ? (
                          <>{alerta.residencia_logradouro}, {alerta.residencia_numero}</>
                        ) : (
                          <>Bloco {alerta.residencia_logradouro}, {alerta.residencia_numero}</>
                        )}
                        <div className="text-xs text-foreground/80">
                          {alerta.bairro}, {alerta.cidade} / {alerta.uf}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/80 text-white font-semibold uppercase">
                      <AlertTriangle className="w-4 h-4" /> {alerta.tipo.replace("_", " ")}
                    </span>
                  </td>

                  <td className="text-sm px-4 py-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${alerta.status === "ativo" ? "bg-green-600" : "bg-destructive"
                        }`}
                    />
                  </td>

                  <td className="text-sm px-4 py-2">{alerta.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
