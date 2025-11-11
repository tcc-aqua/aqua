"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { AlertTriangle, Droplet, Flame, Check, Siren, XCircle, X, Home, CalendarDays, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";
import AlertasFilter from "../Filters/Alertas";

export default function AlertasDashboard() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    vazamentos: 0,
    consumoAlto: 0,
    resolvidos: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedAlerta, setSelectedAlerta] = useState(null);

  const API_ALERTAS = "http://localhost:3333/api/alertas";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resAll, resAtivos, resVaz, resConsumo, resInativos] = await Promise.all([
        fetch(`${API_ALERTAS}`),
        fetch(`${API_ALERTAS}/count/ativos`),
        fetch(`${API_ALERTAS}/count/vazamentos`),
        fetch(`${API_ALERTAS}/count/consumo-alto`),
        fetch(`${API_ALERTAS}/inativos`), // para contar resolvidos/inativos
      ]);

      if (!resAll.ok || !resAtivos.ok || !resVaz.ok || !resConsumo.ok || !resInativos.ok) {
        throw new Error("Erro ao buscar dados dos alertas.");
      }

      // CORRETO: aguardar cada res.json() a partir das responses
      const [allData, ativosData, vazData, consData, inativosData] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resVaz.json(),
        resConsumo.json(),
        resInativos.json(),
      ]);

      // allData pode vir como { docs: [...] } ou como array direto
      const alertasArray = Array.isArray(allData) ? allData : allData.docs ?? [];

      setAlertas(alertasArray);

      setStats({
        total: alertasArray.length,
        ativos: ativosData.total ?? (Array.isArray(ativosData) ? ativosData.length : 0),
        vazamentos: vazData.total ?? (Array.isArray(vazData) ? vazData.length : 0),
        consumoAlto: consData.total ?? (Array.isArray(consData) ? consData.length : 0),
        resolvidos: Array.isArray(inativosData) ? inativosData.length : inativosData.total ?? 0,
      });
    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resolverAlerta = async () => {
    if (!selectedAlerta) return;
    try {
      const res = await fetch(`${API_ALERTAS}/${selectedAlerta.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolvido: true }), 
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Erro ao resolver alerta.");
      }

      toast.success("Alerta resolvido com sucesso!");
      setShowModal(false);
      setSelectedAlerta(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao resolver alerta.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Alertas",
      value: stats.ativos,
      icon: AlertTriangle,
      iconColor: "text-accent",
      detalhe: "Últimas 24 horas"

    },
    {
      title: "Vazamentos",
      value: stats.vazamentos,
      icon: Droplet,
      iconColor: "text-destructive",
      subTitle: "Requer atenção"
    },
    {
      title: "Não Resolvidos",
      value: stats.consumoAlto,
      icon: Flame,
      iconColor: "text-destructive",
       subTitle: "Críticos"
    },
    {
      title: "Consumo Alto",
      value: stats.resolvidos,
      icon: Check,
      iconColor: "text-yellow-300",
      subTitle2: "Monitoramento"
    },
  ];

  const nivelClasses = {
    baixo: "bg-green-100 text-green-700",
    medio: "bg-yellow-100 text-yellow-700",
    alto: "bg-orange-200 text-destructive/100",
    critico: "bg-destructive/20 text-destructive font-semibold",
  };

  const formatDate = (a) => {
    const d = a?.data_registro ?? a?.criado_em ?? a?.criadoAt ?? a;
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(d);
    }
  };

    const getIcone = () => {
    switch (selectedAlerta?.nivel?.toLowerCase()) {
      case "alto":
        return <AlertTriangle className="h-10 w-10 text-red-500" />;
      case "médio":
        return <Info className="h-10 w-10 text-yellow-500" />;
      case "baixo":
        return <Check className="h-10 w-10 text-green-500" />;
      default:
        return <X className="h-10 w-10 text-yellow-500" />;
    }
  };
    // Faixa colorida no topo de acordo com o nível
  const getNivelColor = () => {
    switch (selectedAlerta?.nivel?.toLowerCase()) {
      case "alto":
        return "bg-red-500";
      case "médio":
        return "bg-yellow-500";
      case "baixo":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <>
    <div className="p-4">
      <Toaster position="top-right" richColors />
      <div className="mb-10">

      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <AnimationWrapper key={card.title} delay={i * 0.15}>
              <Card className=" hover:border-sky-400 dark:hover:border-sky-700">
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                   <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <div className="flex flex-col">

                    <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                    {card.valueAtivos && (
                      <p className="text-orange-300 text-sm mt-1">
                        {card.valueAtivos.casas} 
                      </p>
                    )}
                    {card.detalhe && !card.valueAtivos && (
                      <p className="text-sm mt-1 text-accent">{card.detalhe}</p>
                    )}
                    {card.subTitle && (
                      <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>
                    )}

                    {card.subTitle2 && (
                      <p className="text-sm mt-1 text-yellow-300">{card.subTitle2}</p>
                    )}
                  </div>
                  <Icon className={`w-8 h-8 bg-${card.iconColor} ${card.iconColor}`} />
                </CardContent>
              </Card>
            </AnimationWrapper>
          );
        })}
      </section>

      <AnimationWrapper delay={0.3}>
        <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-700">
          <CardHeader>
            <CardTitle>Lista de Alertas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {alertas.length === 0 ? (
              <p>Nenhum alerta encontrado.</p>
            ) : (
              <table className="min-w-full divide-y divide-border ">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Residência</th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase">Mensagem</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Nível</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Data</th>
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alertas.map((alerta) => {
                    const nivel = (alerta.nivel || alerta.level || "baixo").toLowerCase();
                    const isResolved = alerta.resolvido === true || alerta.resolvido === "true" || alerta.resolved === true;
                    const tipo = alerta.tipo ?? alerta.type ?? "-";
                    const residenciaType = alerta.residencia_type ?? alerta.residenciaType ?? "-";
                    const residenciaId = alerta.residencia_id ?? alerta.residenciaId ?? "-";
                    return (
                      <tr key={alerta.id} className="hover:bg-muted/10 text-foreground">
                        <td className="px-4 py-3 text-sm font-semibold flex items-center gap-2">
                          {tipo === "vazamento" ? (
                            <Droplet className="w-4 h-4 text-blue-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                          <span className="capitalize">{tipo.replace("_", " ")}</span>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{residenciaType}</div>
                          <div className="text-xs text-foreground/70">ID: {residenciaId}</div>
                        </td>

                        <td className="px-4 py-3 text-sm text-center">{alerta.mensagem || "-"}</td>

                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${nivelClasses[nivel] ?? ""}`}>
                            {nivel}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold">
                          {isResolved ? (
                            <span className="text-green-600 " size={14}><Check/></span>
                          ) : (
                            <span className="text-destructive"  size={14}><Siren></Siren></span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-xs text-foreground/70">
                          {formatDate(alerta)}
                        </td>

                        <td className="px-4 py-3 text-sm flex gap-2">
                          {!isResolved && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedAlerta(alerta);
                                setShowModal(true);
                              }}
                            >
                              Resolver
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              
                              setSelectedAlerta(alerta);
                              setShowModal(true);
                            }}
                          >
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </AnimationWrapper>

     
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
    
        <div className={`h-2 w-full rounded-t-md ${getNivelColor()}`} />

        {/* Cabeçalho */}
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
          {getIcone()}
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Detalhes do Alerta
          </DialogTitle>
        </DialogHeader>

        {/* Corpo organizado */}
        <div className="mt-5 space-y-4 px-2 text-sm text-foreground/90">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/40 rounded-xl p-3 border border-border">
              <p className="text-xs uppercase text-muted-foreground">Tipo</p>
              <p className="font-semibold text-foreground mt-1">
                {selectedAlerta?.tipo ?? selectedAlerta?.type ?? "-"}
              </p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 border border-border">
              <p className="text-xs uppercase text-muted-foreground">Nível</p>
              <p
                className={`font-semibold mt-1 ${
                  selectedAlerta?.nivel === "alto"
                    ? "text-red-500"
                    : selectedAlerta?.nivel === "medio"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {selectedAlerta?.nivel ?? "-"}
              </p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 border border-border">
              <p className="text-xs uppercase text-muted-foreground">
                Residência
              </p>
              <p className="font-semibold mt-1 flex items-center gap-1">
                <Home className="h-4 w-4 text-muted-foreground" />
                {selectedAlerta?.residencia_type ?? "-"} #
                {selectedAlerta?.residencia_id ?? "-"}
              </p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 border border-border">
              <p className="text-xs uppercase text-muted-foreground">Data</p>
              <p className="font-semibold mt-1 flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(selectedAlerta)}
              </p>
            </div>
          </div>

    
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />{" "}
              Mensagem
            </p>
            <p className="leading-relaxed text-foreground/90">
              {selectedAlerta?.mensagem ?? "-"}
            </p>
          </div>
        </div>

   
        <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowModal(false);
              setSelectedAlerta(null);
            }}
          >
            Fechar
          </Button>
          {!selectedAlerta?.resolvido && (
            <Button className="bg-green-500 hover:bg-green-600" onClick={resolverAlerta}>
              Marcar como resolvido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
    </>
  );
}
