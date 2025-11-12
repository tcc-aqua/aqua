"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Home, X, Check, User, Droplet, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";
import CasaFilter from "../Filters/Casa";
import AnimationWrapper from "../Layout/Animation/Animation";
import { PaginationDemo } from "../pagination/pagination";
import { Separator } from "../ui/separator";
import ExportarTabela from "../Layout/ExportTable/page";


export default function CasasDashboard() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [casaStats, setCasaStats] = useState({ total: 0, ativas: 0, inativas: 0, alertas: 0 });
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });
  const [filters, setFilters] = useState({});

  const API_CASAS = "http://localhost:3333/api/casas";

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);


      const [resAll, resAtivos, resInativos, resCount, resCountAtivas] = await Promise.all([
        fetch(`${API_CASAS}`),
        fetch(`${API_CASAS}/ativos`),
        fetch(`${API_CASAS}/inativos`),
        fetch(`${API_CASAS}/count`),
        fetch(`${API_CASAS}/count-ativas`)
      ]);

      if (!resAll.ok || !resAtivos.ok || !resInativos.ok || !resCount.ok || !resCountAtivas.ok) {
        throw new Error("Erro ao buscar dados das casas.");
      }

      const [allData, ativosData, inativosData, countData, countAtivasData] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
        resCountAtivas.json()
      ]);

      const casasArray = allData.docs || [];


      const filteredCasas = casasArray.filter(casa => {
        const matchesSearch = filters.search
          ? casa.endereco_completo.toLowerCase().includes(filters.search.toLowerCase()) ||
          (casa.casa_codigo?.toLowerCase().includes(filters.search.toLowerCase()))
          : true;

        const matchesStatus = filters.status
          ? casa.casa_status === filters.status
          : true;

        const matchesSensor = filters.sensor_status
          ? casa.sensor_status === filters.sensor_status
          : true;

        return matchesSearch && matchesStatus && matchesSensor;
      });

      setCasas(filteredCasas);


      setCasaStats({
        total: countData.total ?? casasArray.length,
        ativas: countAtivasData.total ?? ativosData.docs?.length ?? 0,
        inativas: inativosData.docs?.length ?? 0,
        alertas: filteredCasas.reduce((acc, c) => acc + (c.alertas || 0), 0),
      });
      const sensorStats = filteredCasas.reduce(
        (acc, casa) => {

          if (!casa.sensor_status) return acc;

          acc.litrosTotais += parseFloat(casa.consumo_total) || 0;

          if (casa.sensor_status === "ativo") acc.ativos += 1;
          else if (casa.sensor_status === "inativo") acc.inativos += 1;
          else acc.alertas += 1;

          acc.total += 1;

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


  const { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus } =
    useToggleConfirm(API_CASAS, fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Casas",
      value: casaStats.total,
      valueAtivos: { casas: casaStats.ativas },
      icon: Home,
      bg: "bg-card",
      iconColor: "text-orange-300",
    },
    {
      title: "Total de Moradores",
      value: casas.reduce((acc, c) => acc + (Number(c.numero_moradores) || 0), 0),
      icon: User,
      bg: "bg-card",
      iconColor: "text-purple-700",
      subTitle: casas.length > 0
        ? `Média de ${(casas.reduce((acc, c) => acc + (Number(c.numero_moradores) || 0), 0) / casas.length).toFixed(0)} por casa`
        : "0"
    },
    {
      title: "Sensores Ativos",
      value: sensorStats.ativos,
      icon: Check,
      bg: "bg-card",
      iconColor: "text-green-700",
      porcentagem: sensorStats.total > 0
        ? ((sensorStats.ativos / sensorStats.total) * 100).toFixed(0) + "% operacionais"
        : "0% operacionais"
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
      bg: "bg-card",
      iconColor: "text-accent",
      subTitle2: "Litros acumulados"
    }
  ];


  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <CasaFilter onApply={(filters) => fetchData(filters)} />

        </div>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (

              <AnimationWrapper key={card.title} delay={i * 0.2}>
                <Card className=" hover:border-sky-400 dark:hover:border-sky-950">
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">

                      <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                      {card.valueAtivos && (
                        <p className="text-orange-300 text-sm mt-1">
                          {card.valueAtivos.casas} ativas
                        </p>
                      )}
                      {card.porcentagem && !card.valueAtivos && (
                        <p className="text-sm mt-1 text-green-600">{card.porcentagem}</p>
                      )}
                      {card.subTitle && (
                        <p className="text-sm mt-1 text-purple-600">{card.subTitle}</p>
                      )}

                      {card.subTitle2 && (
                        <p className="text-sm mt-1 text-accent">{card.subTitle2}</p>
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
          <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle>Lista de Casas
                <ExportarTabela data={casas} filtros={filters} fileName="casas" />
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {casas.length === 0 ? (
                <p>Nenhuma casa encontrada.</p>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Casa</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Morador Principal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sensor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Consumo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th> */}
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {casas.map(casa => (
                      <tr key={casa.casa_id} className="hover:bg-muted/10 text-foreground">
                        <td className="px-4 py-2">
                          <div className="text-sm font-semibold">{casa.endereco_completo}</div>
                          <div className="text-xs text-foreground/80">{`${casa.numero_moradores || 0} Moradores`}</div>
                          <div className="text-[10px] text-foreground/60">CEP: {casa.cep}</div>
                          <div className="text-[10px] text-accent">Código {casa.casa_codigo}</div>

                        </td>
                        <td className="px-4 py-2 text-sm">
                          {casa.responsavel_nome}
                          <div className="text-xs text-foreground/80">
                            {casa.responsavel_email}
                          </div>
                          <div className="text-xs text-foreground/60">
                            {casa.responsavel_cpf}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="font-bold">{casa.sensor_codigo}</div>
                          <div className=" text-sm font-bold">
                            <span className={casa.sensor_status === "ativo" ? "text-green-600" : "text-destructive"}>
                              {casa.sensor_status === "ativo" ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="text-[10px] text-foreground/60"> ID : {casa.sensor_id}</div>
                          <div className="text-[10px] text-foreground/60">
                            Último envio: {casa.ultimo_envio
                              ? new Date(casa.ultimo_envio).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-2 text-sm font-bold">{casa.consumo_total || 0}L
                          <div className="text-[10px] text-foreground/60">Total Acumulado</div>
                        </td>
                        <td className="text-sm font-bold flex items-center ml-7 py-10">
                          <span className={`inline-block w-3 h-3 rounded-full ${casa.casa_status === "ativo" ? "bg-green-600" : "bg-destructive"}`} title={casa.casa_status} />
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(casa)}>
                            <div className="flex items-center gap-1">
                              {casa.casa_status === "ativo" ? (
                                <Check className="text-green-500" size={14} />
                              ) : (
                                <X className="text-destructive" size={14} />
                              )}
                            </div>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
            <Separator></Separator>
            <PaginationDemo className='my-20' />
          </Card>
        </AnimationWrapper>


        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

            {/* Barra superior colorida */}
            <div
              className={`h-2 w-full rounded-t-md ${selectedItem?.casa_status === "ativo" ? "bg-red-600" : "bg-green-600"
                }`}
            />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div
                className={`p-4 rounded-full ${selectedItem?.casa_status === "ativo"
                    ? "bg-red-100 dark:bg-red-900"
                    : "bg-green-100 dark:bg-green-900"
                  }`}
              >
                <AlertTriangle
                  className={`h-10 w-10 ${selectedItem?.casa_status === "ativo"
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
                  className={`font-semibold ${selectedItem?.casa_status === "ativo"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                    }`}
                >
                  {selectedItem?.casa_status === "ativo" ? "inativar" : "ativar"}
                </span>{" "}
                a casa <strong>{selectedItem?.endereco_completo}</strong>?
              </p>

              {/* Código da casa */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <p className="text-xs uppercase text-muted-foreground mb-1">Código da Casa</p>
                <p className="font-semibold">{selectedItem?.casa_codigo ?? "-"}</p>
              </div>

              {/* Endereço completo */}
              {/* <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <p className="text-xs uppercase text-muted-foreground mb-1">Endereço</p>
                <p className="font-semibold">
                  {`${selectedItem?.logradouro}, ${selectedItem?.numero} - ${selectedItem?.bairro}, ${selectedItem?.cidade} / ${selectedItem?.uf}`}
                </p>
              </div> */}
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                className={`flex items-center gap-2 px-6 py-3 text-white transition ${selectedItem?.casa_status === "ativo"
                    ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                onClick={toggleStatus}
              >
                <Check className="h-5 w-5" />
                {selectedItem?.casa_status === "ativo" ? "Inativar" : "Ativar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </>
  );
}
