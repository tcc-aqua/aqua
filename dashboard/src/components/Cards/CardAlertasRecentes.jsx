'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

const API_URL = "http://localhost:3333/api/alertas/recentes";

export default function CardAlertasRecentes() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlertas() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Garante que alertas seja um array
        setAlertas(Array.isArray(data) ? data : data.alertas ?? []);
      } catch (error) {
        console.error("Erro ao buscar alertas recentes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlertas();
  }, []);

  return (
    <Card className="w-full max-w-md mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
      <h1 className="text-red-600">Alertas Recentes</h1>
        </CardTitle>
        <CardDescription>
          Últimos alertas gerados no sistema
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Carregando...</p>
        ) : alertas.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Nenhum alerta recente</p>
        ) : (
          <ScrollArea className="h-64">
            <div className="flex flex-col divide-y divide-border">
              {alertas.map((alerta) => (
                <div key={alerta.id} className="p-4 flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{alerta.residencia_type}</p>
                    <p className="font-semibold text-foreground">{alerta.tipo}</p>
                    <p className="text-sm text-muted-foreground">{alerta.mensagem}</p>
                    <p className="font-semibold text-foreground">{alerta.sensor_id}</p>
                    <p className="font-semibold text-foreground">{alerta.nivel}</p>
                    <p className="font-semibold text-foreground">{alerta.resolvido}</p>
                      <div className="text-[10px] text-foreground/60">
                         {alerta.criado_em
                          ? new Date(alerta.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "-"} Crado em
                      </div>
                      
                      <div className="text-[10px] text-foreground/60">
                         {alerta.atualizado_em
                          ? new Date(alerta.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "-"} Atualizado em
                      </div>
                    
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                      alerta.status === "ativo"
                        ? "bg-red-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {alerta.status}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
