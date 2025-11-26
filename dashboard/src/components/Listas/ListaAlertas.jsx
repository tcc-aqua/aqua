"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { AlertTriangle, Droplet, Check, Siren, X, Home, CalendarDays, MessageSquare, Info, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";
import ExportarTabela from "../Layout/ExportTable/page";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
  const [filters, setFilters] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedAlerta, setSelectedAlerta] = useState(null);


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const API_ALERTAS = "http://localhost:3333/api/alertas";

  const fetchData = async (filters = {}, page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });

      const [resAll, resAtivos, resVaz, resConsumo, resInativos] = await Promise.all([
        fetch(`${API_ALERTAS}?${params.toString()}`),
        fetch(`${API_ALERTAS}/count/ativos`),
        fetch(`${API_ALERTAS}/count/vazamentos`),
        fetch(`${API_ALERTAS}/count/consumo-alto`),
        fetch(`${API_ALERTAS}/inativos`),
      ]);

      if (!resAll.ok || !resAtivos.ok || !resVaz.ok || !resConsumo.ok || !resInativos.ok) {
        throw new Error("Erro ao buscar dados dos alertas.");
      }

      const [allData, ativosData, vazData, consData, inativosData] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resVaz.json(),
        resConsumo.json(),
        resInativos.json(),
      ]);

      const alertasArray = Array.isArray(allData) ? allData : allData.docs ?? [];


      const filteredAlertas = alertasArray.filter((alerta) => {
        const matchesTipo = filters.tipo ? alerta.tipo === filters.tipo : true;
        const matchesNivel = filters.nivel ? alerta.nivel === filters.nivel : true;
        const matchesStatus = filters.status
          ? alerta.resolvido === (filters.status === "resolvido")
          : true;
        const matchesResidencia = filters.residencia
          ? alerta.residencia_id === filters.residencia
          : true;
        return matchesTipo && matchesNivel && matchesStatus && matchesResidencia;
      });

      setAlertas(filteredAlertas);

      const totalUsers = allData.total ?? alertasArray.length;
      setTotalPages(Math.ceil(totalUsers / limit));

      setStats({
        total: alertasArray.length,
        ativos: Number(ativosData.total ?? ativosData ?? 0),
        vazamentos: Number(vazData.total ?? vazData ?? 0),
        consumoAlto: Number(consData.total ?? consData ?? 0),
        resolvidos: Number(inativosData.total ?? inativosData ?? 0),
      });

    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };


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


      await fetchData(filters, page, limit);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao resolver alerta.");
    }
  };

  useEffect(() => {
    fetchData(filters, page, limit);
  }, [page, filters]);


  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Alertas",
      value: stats.total,
      icon: AlertTriangle,
      iconColor: "text-accent",
      detalhe: "Últimas 24 horas",
      borderColor: "border-b-accent"

    },
    {
      title: "Vazamentos",
      value: stats.vazamentos,
      icon: Info,
      iconColor: "text-yellow-500",
      subTitle1: "Requer atenção",
      borderColor: "border-b-yellow-500"
    },
    {
      title: "Consumo Alto",
      value: stats.consumoAlto,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      subTitle: "Críticos",
      borderColor: "border-b-red-500"
    },

    {
      title: "Resolvidos",
      value: stats.resolvidos,
      icon: Check,
      iconColor: "text-green-500",
      subTitle2: "Monitoramento",
      borderColor: "border-b-green-500"
    },
  ]

  const nivelClasses = {
    baixo: "bg-green-100 text-green-700",
    medio: "bg-yellow-100 text-yellow-700",
    alto: "bg-red-100 text-destructive/100",
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
      case "medio":
        return <Info className="h-10 w-10 text-yellow-500" />;
      case "baixo":
        return <Check className="h-10 w-10 text-green-500" />;
      default:
        return <X className="h-10 w-10 text-destructive" />;
    }
  };

  const getNivelColor = () => {
    switch (selectedAlerta?.nivel?.toLowerCase()) {
      case "alto":
        return "bg-red-500";
      case "medio":
        return "bg-yellow-500";
      case "baixo":
        return "bg-green-500";
      default:
        return "bg-destructive";
    }
  };

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <AlertasFilter onApply={(newFilters) => fetchData(newFilters, 1, limit)} />

        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimationWrapper key={card.title} delay={i * 0.2}>
                <Card className={`border-b-4 ${card.borderColor}`}>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">

                      <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                      {card.subTitle1 && (
                        <p className="text-yellow-400 text-sm mt-1">
                          {card.subTitle1}
                        </p>
                      )}
                      {card.detalhe && !card.valueAtivos && (
                        <p className="text-sm mt-1 text-accent">{card.detalhe}</p>
                      )}
                      {card.subTitle && (
                        <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>
                      )}

                      {card.subTitle2 && (
                        <p className="text-sm mt-1 text-green-500">{card.subTitle2}</p>
                      )}
                    </div>
                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </section>


        <AnimationWrapper delay={0.3}>
          <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle>Lista de Alertas
                <ExportarTabela data={alertas} filtros={filters} fileName="alertas" />
              </CardTitle>
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

                              <div className="relative inline-block group">
                                <span className="text-green-600" size={14}>
                                  <Check />
                                </span>

                                <div className="absolute z-10 top-1/2 left-full ml-4 w-max px-2 py-1 bg-green-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-y-1/2">
                                  Resolvido
                                </div>
                              </div>
                            ) : (

                              <div className="relative inline-block group">
                                <span className="text-destructive" size={14}>
                                  <Siren />
                                </span>

                                <div className="absolute z-10 top-1/2 left-full ml-4 w-max px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -translate-y-1/2">
                                  Não Resolvido
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-foreground/70">
                            {formatDate(alerta)}
                          </td>

                          <td className="px-4 py-3 text-sm flex gap-1 justify-center items-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title={!isResolved ? "Marcar como resolvido" : "Ver detalhes"}
                                  onClick={() => {
                                    setSelectedAlerta(alerta);
                                    setShowModal(true);

                                    if (!isResolved) {
                                      console.log("Alerta marcado para ser resolvido");
                                    }
                                  }}
                                  className="text-sky-600 hover:text-blue-950"
                                >
                                  <Eye className="w-5 h-5" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>
                                Visualizar
                              </TooltipContent>
                            </Tooltip>

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
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

            <div className={`h-2 w-full rounded-t-md ${getNivelColor()}`} />


            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              {getIcone()}
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Detalhes do Alerta
              </DialogTitle>
            </DialogHeader>


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
                    className={`font-semibold mt-1 ${selectedAlerta?.nivel === "alto"
                      ? "text-red-500"
                      : selectedAlerta?.nivel === "medio"
                        ? "text-yellow-500"
                        : selectedAlerta?.nivel === "baixo"
                          ? "text-green-500"
                          : "text-destructive"
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
                <Button className="bg-green-500 hover:bg-green-600 cursor-pointer" onClick={resolverAlerta}>
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
