'use client'

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Home, Building } from "lucide-react";

const API_URL = "http://localhost:3333/api/alertas/recentes";

export default function CardAlertasRecentes() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlertas() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();


        setAlertas(Array.isArray(data) ? data : data.alertas ?? []);
      } catch (error) {
        console.error("Erro ao buscar alertas recentes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlertas();
  }, []);


  const renderIconeResidencia = (type) => {
    const iconProps = { className: "w-4 h-4 mr-1", 'aria-label': type === 'Casa' ? 'Casa' : 'Condomínio/Apartamento' };

    if (type && type.toLowerCase().includes('casa')) {
      return <Home {...iconProps} />;
    } else if (type && (type.toLowerCase().includes('apartamento') || type.toLowerCase().includes('condominio'))) {
      return <Building {...iconProps} />;
    }
    return null;
  };


  const getAlertaLevelColorClasses = (nivel) => {
    let spanBgClass = '';
    let spanTextClass = 'text-white';

    switch (nivel?.toLowerCase()) {
      case 'baixo':
        spanBgClass = 'bg-green-400';
        break;
      case 'medio':
        spanBgClass = 'bg-yellow-400';
        break;
      case 'alto':
        spanBgClass = 'bg-red-500';
        break;
      case 'critico':
        spanBgClass = 'bg-red-700';
        break;
      default:
        spanBgClass = 'bg-gray-500';
    }
    return { spanBgClass, spanTextClass };
  };


  return (
    <Card className="w-full mt-10  hover:border-sky-400 dark:hover:border-sky-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h1 className="text-destructive">Alertas Recentes</h1>
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
              {alertas.map((alerta) => {

                const { spanBgClass, spanTextClass } = getAlertaLevelColorClasses(alerta.nivel);

                return (
                  <div key={alerta.id} className="p-4 flex justify-between m-2 bg-muted/10 items-start w-100 rounded-lg gap-2">
                    <div>

                      <span
                        className={`font-semibold p-1 rounded-full inline-flex items-center gap-1
                ${alerta.residencia_type === "casa" ? "bg-sky-700 text-white" : "bg-purple-400 text-white"}`}
                      >
                        {renderIconeResidencia(alerta.residencia_type)}
                        {alerta.residencia_type}
                      </span>


                      <p className="font-semibold text-foreground mt-1">{alerta.tipo}</p>
                      <p className="text-sm text-muted-foreground">{alerta.mensagem}</p>


                      <div className="text-[10px] text-foreground/60 mt-1">
                      Criado em: {alerta.criado_em
                          ? new Date(alerta.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "-"} 
                      </div>

                      {/* <div className="text-[10px] text-foreground/60">
                        {alerta.atualizado_em
                          ? new Date(alerta.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "-"} Atualizado em
                      </div> */}

                    </div>

                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${spanTextClass} ${spanBgClass}`}
                    >
                      {alerta.nivel}
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}