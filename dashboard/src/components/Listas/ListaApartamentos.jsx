"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import {
  UserCheck,
  X,
  Check,
  Droplet,
  Grid,
  AlertTriangle,
  MapPin,
  Signal,
  User,
  Building,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";
import ApartamentoFilter from "../Filters/Apartamentos";
import AnimationWrapper from "../Layout/Animation/Animation";
import { PaginationDemo } from "../pagination/pagination";
import { Separator } from "../ui/separator";
import ExportarTabela from "../Layout/ExportTable/page";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ApartamentosDashboard() {
  const [apartamentos, setApartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apStats, setApStats] = useState({
    total: 0,
    ativas: 0,
    inativas: 0,
    alertas: 0,
  });
  const [sensorStats, setSensorStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    alertas: 0,
    litrosTotais: 0,
  });
  const [filters, setFilters] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // itens por página
  const [totalPages, setTotalPages] = useState(1);

  const API_AP = "http://localhost:3333/api/apartamentos";

  const fetchData = async (filters = {}, page = 1, limit = 10) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });


      const [resAll, resAtivos, resInativos, resCount] = await Promise.all([
        fetch(`${API_AP}?${params.toString()}`),
        fetch(`${API_AP}/ativos`),
        fetch(`${API_AP}/inativos`),
        fetch(`${API_AP}/count`),
      ]);

      if (!resAll.ok || !resAtivos.ok || !resInativos.ok || !resCount.ok)
        throw new Error("Erro ao buscar dados dos apartamentos.");

      const [allData, ativosData, inativosData, countData] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
      ]);


      let filteredAps = allData.docs || [];
      if (filters.status) {
        filteredAps = filteredAps.filter(
          (ap) => ap.apartamento_status === filters.status
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredAps = filteredAps.filter(
          (ap) =>
            ap.endereco_completo?.toLowerCase().includes(search) ||
            ap.responsavel_nome?.toLowerCase().includes(search)
        );
      }

      setApartamentos(filteredAps);

      const totalItems = allData.total ?? allData.docs.length;
      setTotalPages(Math.ceil(totalItems / limit));

      setApStats({
        total: totalItems,
        ativas: ativosData.total ?? 0,
        inativas: inativosData.total ?? 0,
        alertas: countData.alertas ?? 0, 
      });

      const sensorStats = filteredAps.reduce(
        (acc, ap) => {
          if (ap.sensor_id) acc.total++;
          if (ap.sensor_status === "ativo") acc.ativos++;
          else if (ap.sensor_status) acc.inativos++;
          if (!ap.sensor_id) acc.alertas++;
          acc.litrosTotais += parseFloat(ap.consumo_total) || 0;
          return acc;
        },
        { total: 0, ativos: 0, inativos: 0, alertas: 0, litrosTotais: 0 }
      );
      setSensorStats(sensorStats);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const {
    showModal,
    setShowModal,
    selectedItem: selectedAp,
    confirmToggleStatus,
    toggleStatus,
  } = useToggleConfirm(API_AP, fetchData);


  useEffect(() => {
    fetchData(filters, page, limit);
  }, [page, filters]);

  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  const cards = [
    {
      title: "Apartamentos",
      value: apStats.total,
      valueAtivas: apStats.ativas,
      icon: Building,
      iconColor: "text-orange-300",
        borderColor:" border-b-orange-300"
    },
    {
      title: "Moradores",
      value: apartamentos.reduce(
        (acc, ap) => acc + (Number(ap.numero_moradores) || 0),
        0
      ),
      icon: User,
      iconColor: "text-sky-500",
      subTitle:
        apartamentos.length > 0
          ? `Média de ${(
            apartamentos.reduce(
              (acc, ap) => acc + (Number(ap.numero_moradores) || 0),
              0
            ) / apartamentos.length
          ).toFixed(0)} / unidade`
          : "0",
            borderColor:" border-b-sky-500 "
    },
    {
      title: "Sensores Ativos",
      value: sensorStats.ativos,
      icon: Check,
      iconColor: "text-green-700",
      porcentagem:
        sensorStats.total > 0
          ? ((sensorStats.ativos / sensorStats.total) * 100).toFixed(0) +
          "% operacionais"
          : "0% operacionais",
            borderColor:" border-b-green-700 "
    },
    {
      title: "Consumo Total",
      value: (() => {
        const litros = Number(sensorStats.litrosTotais) || 0;
        if (litros >= 1_000_000) return (litros / 1_000_000).toFixed(1) + "M";
        if (litros >= 1_000) return (litros / 1_000).toFixed(1) + "K";
        return litros.toFixed(1);
      })(),
      icon: Droplet,
      iconColor: "text-blue-500",
      subTitle2: "Litros acumulados",
        borderColor:" border-b-blue-500 "
    },
  ];

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <ApartamentoFilter onApply={(filters) => fetchData(filters)} />
        </div>


        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimationWrapper key={card.title} delay={i * 0.2}>
             <Card className={`border-b-4 ${card.borderColor}`}>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">
                      <p className="font-bold text-4xl text-foreground">
                        {card.value ?? 0}
                      </p>
                      {card.valueAtivas && (
                        <p className="text-orange-300 text-sm mt-1">
                          {card.valueAtivas} Ativos
                        </p>
                      )}
                      {card.porcentagem && (
                        <p className="text-sm mt-1 text-green-600">
                          {card.porcentagem}
                        </p>
                      )}
                      {card.subTitle && (
                        <p className="text-sm mt-1 text-sky-500">
                          {card.subTitle}
                        </p>
                      )}
                      {card.subTitle2 && (
                        <p className="text-sm mt-1 text-blue-500">
                          {card.subTitle2}
                        </p>
                      )}
                    </div>
                    <Icon className={`w-10 h-10 ${card.iconColor}`} />
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </section>

        <AnimationWrapper delay={0.3}>
          <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle>Lista de Apartamentos
                <ExportarTabela data={apartamentos} filtros={filters} fileName="apartamentos" />
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {apartamentos.length === 0 ? (
                <p>Nenhum apartamento encontrado.</p>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Unidade
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Morador Principal
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Sensor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Consumo
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Status
                      </th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                      Alertas
                    </th> */}
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apartamentos.map((ap) => (
                      <tr
                        key={ap.apartamento_id}
                        className="hover:bg-muted/10 text-foreground"
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-sky-600 mt-5" />
                            <div className="flex flex-col">
                              <div className="text-sm font-semibold">
                              Bloco - {ap.endereco_completo}
                              </div>
                              <div className="text-xs text-foreground/80">
                                {ap.endereco_condominio}
                              </div>
                              <div className="text-xs text-foreground/80">
                                {`${ap.numero_moradores || 0} Moradores`}
                              </div>
                              <div className="text-[10px] text-chart-1">
                                Código {ap.apartamento_codigo}
                              </div>
                              <span className={`text-[10px] font-bold ${ap.apartamento_status === "ativo" ? "text-green-600" : "text-destructive"}`}>
                                {ap.apartamento_status === "ativo" ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-2 text-sm">
                          {ap.responsavel_nome}
                          <div className="text-xs text-foreground/80">
                            {ap.responsavel_email}
                          </div>
                          <div className="text-xs text-foreground/60">
                            {ap.responsavel_cpf}
                          </div>
                        </td>


                        <td className="px-4 py-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Signal
                              className={`w-5 h-5 mt-5 ${ap.sensor_status === "ativo" ? "text-green-600" : "text-destructive"}`}
                            />
                            <div className="flex flex-col">
                              <div className="font-bold">{ap.sensor_codigo}</div>
                              <div className="text-sm font-bold">
                                <span className={ap.sensor_status === "ativo" ? "text-green-600" : "text-destructive"}>
                                  {ap.sensor_status === "ativo" ? "Ativo" : "Inativo"}
                                </span>
                              </div>
                              <div className="text-[10px] text-foreground/60">ID : {ap.sensor_id}</div>
                              <div className="text-[10px] text-foreground/60">
                                Último envio:{" "}
                                {ap.ultimo_envio
                                  ? new Date(ap.ultimo_envio).toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-2 text-sm font-bold">
                          <div className="flex items-start gap-2">
                            <Droplet className="w-5 h-5 text-sky-500 mt-1" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {ap.consumo_total || 0}L
                              </span>
                              <span className="text-[10px] text-foreground/60">
                                Total Acumulado
                              </span>
                            </div>
                          </div>
                        </td>

                     
                        
                        <td className="text-sm font-semibold px-3 py-4">
                          <span
                            className={`
                             inline-flex items-center gap-2 px-2 py-1 rounded-md border 
                              ${ap.apartamento_status === "ativo"
                                ? "text-green-500 border-green-600"
                                : "text-destructive border-red-600"}`}
                          >

                            {ap.apartamento_status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-sm">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => confirmToggleStatus(ap)}
                              >
                                <div className="flex items-center gap-1">
                                  {ap.apartamento_status === "ativo" ? (
                                    <Check className="text-green-500" size={14} />
                                  ) : (
                                    <X className="text-destructive" size={14} />
                                  )}
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {ap.apartamento_status === "ativo"
                                ? "Inativar apartamneto"
                                : "Ativar apartamneto"}
                            </TooltipContent>
                          </Tooltip>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
            <Separator></Separator>
            <PaginationDemo
              currentPage={page}
              totalPages={totalPages}
              onChangePage={(newPage) => setPage(newPage)}
              maxVisible={5}
            />
          </Card>
        </AnimationWrapper>



        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

            {/* Barra superior colorida */}
            <div
              className={`h-2 w-full rounded-t-md ${selectedAp?.apartamento_status === "ativo" ? "bg-red-600" : "bg-green-600"
                }`}
            />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div
                className={`p-4 rounded-full ${selectedAp?.apartamento_status === "ativo"
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-green-100 dark:bg-green-900"
                  }`}
              >
                <AlertTriangle
                  className={`h-10 w-10 ${selectedAp?.apartamento_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Confirmação
              </DialogTitle>
            </DialogHeader>

            <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
              <p className="text-lg">
                Deseja realmente{" "}
                <span
                  className={`font-semibold ${selectedAp?.apartamento_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                >
                  {selectedAp?.apartamento_status === "ativo" ? "inativar" : "ativar"}
                </span>{" "}
                o apartamento <strong>Bloco {selectedAp?.endereco_completo}</strong>?
              </p>

              {/* Código do apartamento */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <p className="text-xs uppercase text-muted-foreground mb-1">Código do Apartamento</p>
                <p className="font-semibold">{selectedAp?.apartamento_codigo ?? "-"}</p>
              </div>

              {/* Endereço completo */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <p className="text-xs uppercase text-muted-foreground mb-1">Endereço</p>
                <p className="font-semibold">
                  {`${selectedAp?.logradouro}, ${selectedAp?.numero} - ${selectedAp?.bairro}, ${selectedAp?.cidade} / ${selectedAp?.uf}`}
                </p>
              </div>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                className={`flex items-center gap-2 px-6 py-3 text-white transition ${selectedAp?.apartamento_status === "ativo"
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                onClick={toggleStatus}
              >
                <Check className="h-5 w-5" />
                {selectedAp?.apartamento_status === "ativo" ? "Inativar" : "Ativar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}
