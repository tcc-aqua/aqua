"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Cpu, X, Check, Droplet, XCircle, CheckCircle, AlertTriangle, Signal, MapPin } from "lucide-react";
import useToggleConfirm from "@/hooks/useStatus"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SensorFilter from "../Filters/Sensors";
import AnimationWrapper from "../Layout/Animation/Animation";
import { PaginationDemo } from "../pagination/pagination";
import { Separator } from "../ui/separator";
import ExportarTabela from "../Layout/ExportTable/page";

export default function SensorsDashboard() {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });
  const [filters, setFilters] = useState({});

  const API_URL = "http://localhost:3333/api/sensores";
  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);

      const [totalRes, ativosRes, inativosRes, allRes] = await Promise.all([
        fetch(`${API_URL}/count`),
        fetch(`${API_URL}/count-ativos`),
        fetch(`${API_URL}/inativos`),
        fetch(`${API_URL}/`),
      ]);

      if (!totalRes.ok || !ativosRes.ok || !inativosRes.ok || !allRes.ok) {
        throw new Error("Erro ao buscar dados dos sensores.");
      }

      const total = await totalRes.json();
      const allSensores = await allRes.json();
      const sensoresArray = allSensores.docs || [];

      // Filtragem local
      const filteredSensores = sensoresArray.filter(sensor => {
        const matchesStatus = filters.status ? sensor.sensor_status === filters.status : true;
        const matchesLocation = filters.location ? sensor.localizacao?.toLowerCase().includes(filters.location.toLowerCase()) : true;
        const matchesType = filters.type ? sensor.residencia_type === filters.type : true;
        return matchesStatus && matchesLocation && matchesType;
      });
      const sensorStatsData = filteredSensores.reduce(
        (acc, s) => {
          // Soma o consumo total garantindo número
          acc.litrosTotais += parseFloat(s.consumo_total) || 0;

          // Conta tipo de residência
          if (s.residencia_type === "casa") acc.casas += 1;
          if (s.residencia_type === "apartamento") acc.apartamentos += 1;

          // Conta status do sensor
          if (s.sensor_status === "ativo") acc.ativos += 1;
          else if (s.sensor_status === "inativo") acc.inativos += 1;
          else acc.alertas += 1;

          return acc;
        },
        { ativos: 0, inativos: 0, alertas: 0, litrosTotais: 0, casas: 0, apartamentos: 0 }
      );


      setSensorStats({
        total: total ?? filteredSensores.length,
        ativos: sensorStatsData.ativos,
        inativos: sensorStatsData.inativos,
        alertas: sensorStatsData.alertas,
        litrosTotais: sensorStatsData.litrosTotais,
        casas: sensorStatsData.casas,
        apartamentos: sensorStatsData.apartamentos
      });

      setSensores(filteredSensores);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus } = useToggleConfirm(API_URL, fetchData);

  useEffect(() => {
    fetchData();
  }, []);


  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Sensores",
      value: sensorStats.total,
      valueAtivos: { casas: sensorStats.casas, apartamentos: sensorStats.apartamentos },
      icon: Signal,
      bg: "bg-card",
      iconColor: "text-purple-700",
    },
    {
      title: "Sensores Ativos",
      value: sensorStats.ativos,
      icon: Check,
      bg: "bg-card",
      iconColor: "text-green-700",
      porcentagem: ((sensorStats.ativos / sensorStats.total) * 100).toFixed(0) + "%" + " operacionais",
    },
    {
      title: "Sensores Inativos",
      value: sensorStats.inativos,
      icon: X,
      bg: "bg-card",
      iconColor: "text-red-600",
      subTitle: "Precisa de atenção"
    },
    {
      title: "Litros Totais",
      value: (() => {
        const litros = Number(sensorStats.litrosTotais) || 0;
        if (litros >= 1_000_000) return (litros / 1_000_000).toFixed(1) + "M";
        if (litros >= 1_000) return (litros / 1_000).toFixed(1) + "K";
        return litros.toFixed(1);
      })(),
      icon: Droplet,
      bg: "bg-card",
      iconColor: "text-blue-500",
      subTitle2: "Total acumulado"
    }
  ];

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <SensorFilter onApply={(filters) => fetchData(filters)} />
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimationWrapper key={card.title} delay={i * 0.2}>
                <Card className=" hover:border-sky-400 dark:hover:border-sky-950" >
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">

                      <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                      {card.valueAtivos && (
                        <p className="text-purple-700 text-sm mt-1">
                          {card.valueAtivos.casas} casas + {card.valueAtivos.apartamentos} apartamentos
                        </p>
                      )}
                      {card.porcentagem && !card.valueAtivos && (
                        <p className="text-sm mt-1 text-green-600">{card.porcentagem}</p>
                      )}
                      {card.subTitle && (
                        <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>
                      )}

                      {card.subTitle2 && (
                        <p className="text-sm mt-1 text-blue-500">{card.subTitle2}</p>
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
              <CardTitle>Lista de Sensores
                <ExportarTabela data={sensores} filtros={filters} fileName="sensores" />
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {sensores.length === 0 ? (
                <p>Nenhum sensor encontrado.</p>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Sensor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Localização</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Consumo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Último envio</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sensores.map((sensor) => (
                      <tr key={sensor.sensor_id} className="hover:bg-muted/10 text-foreground">


                        <td className="px-4 py-2">
                          {sensor.sensor_codigo && (
                            <div className="flex items-start gap-2">
                              <Signal
                                className={`w-5 h-5 mt-5 ${sensor.sensor_status === "ativo" ? "text-green-600" : "text-destructive"}`}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {sensor.sensor_codigo}
                                </span>
                                <span className="text-[10px] text-foreground/80">
                                  ID: {sensor.sensor_id}
                                </span>
                                <span className="text-[10px] text-accent">
                                  Tipo de residência: {sensor.residencia_type}
                                </span>
                                <span className={`text-[10px] font-bold ${sensor.sensor_status === "ativo" ? "text-green-600" : "text-destructive"}`}>
                                  {sensor.sensor_status === "ativo" ? "Ativo" : "Inativo"}
                                </span>
                              </div>
                            </div>
                          )}
                        </td>


                        <td className="px-4 py-2 text-sm">
                          {sensor.localizacao && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-5 h-5 text-sky-600 mt-1" />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">
                                  {sensor.localizacao || "-"}
                                </span>
                                <span className="text-[10px] text-foreground/60">
                                  Localização do Sensor
                                </span>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-block w-3 h-3 rounded-full  ${sensor.sensor_status === "ativo" ? "bg-green-600" : sensor.sensor_status === "inativo" ? "bg-destructive" : "bg-yellow-600"}`} title={sensor.sensor_status} />
                        </td>
                        <td className="px-4 py-2 text-sm font-bold">
                          <div className="flex items-start gap-2">
                            <Droplet className="w-5 h-5 text-sky-500 mt-1" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {sensor.consumo_total || 0}L
                              </span>
                              <span className="text-[10px] text-foreground/60">
                                Total Acumulado
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold">
                          {sensor.ultimo_envio
                            ? new Date(sensor.ultimo_envio).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "-"}
                          <div className="text-[10px] text-foreground/60">Horário do Último Envio</div>
                        </td>
                        <td className="px-4 py-2 text-sm text-center">
                          <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(sensor)}>
                            <div className="flex items-center gap-1">
                              {sensor.sensor_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-destructive" size={14} />}
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

            {/* Barra superior colorida de acordo com status */}
            <div
              className={`h-2 w-full rounded-t-md ${selectedItem?.sensor_status === "ativo" ? "bg-red-600" : "bg-green-600"
                }`}
            />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div
                className={`p-4 rounded-full ${selectedItem?.sensor_status === "ativo"
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-green-100 dark:bg-green-900"
                  }`}
              >
                <AlertTriangle
                  className={`h-10 w-10 ${selectedItem?.sensor_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Confirmação
              </DialogTitle>
            </DialogHeader>

            <div className="mt-5 px-4 text-foreground/90 text-center text-lg">
              <p>
                Deseja realmente{" "}
                <span
                  className={`font-semibold ${selectedItem?.sensor_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                >
                  {selectedItem?.sensor_status === "ativo" ? "inativar" : "ativar"}
                </span>{" "}
                o sensor <strong>{selectedItem?.sensor_codigo}</strong>?
              </p>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowModal(false)}
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                className={`flex items-center gap-2 px-6 py-3 text-white transition ${selectedItem?.sensor_status === "ativo"
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                onClick={toggleStatus}
              >
                <Check className="h-5 w-5" />
                {selectedItem?.sensor_status === "ativo" ? "Inativar" : "Ativar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

    </>
  );
}
