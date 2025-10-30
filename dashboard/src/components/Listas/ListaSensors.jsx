"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Cpu, SignalHigh, AlertTriangle, Wrench, X, Check } from "lucide-react";
import useToggleConfirm from "@/hooks/useStatus"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

export default function SensorsDashboard() {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });

  const API_URL = "http://localhost:3333/api/sensores";

  const fetchData = async () => {
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
    const ativos = await ativosRes.json();
    const inativos = await inativosRes.json();
    const allSensores = await allRes.json();
    const sensoresArray = allSensores.docs || [];

  
    const sensorStatsData = sensoresArray.reduce(
      (acc, s) => {
        if (s.sensor_status === "ativo") acc.ativos += 1;
        else if (s.sensor_status === "inativo") acc.inativos += 1;
        else acc.alertas += 1; 

        return acc;
      },
      { ativos: 0, inativos: 0, alertas: 0 }
    );

    setSensorStats({
      total: total ?? sensoresArray.length,
      ativos: sensorStatsData.ativos,
      inativos: sensorStatsData.inativos,
      alertas: sensorStatsData.alertas,
    });

    setSensores(sensoresArray);
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
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Sensores",
      value: sensorStats.total,
      icon: Cpu,
      bg: "bg-card",
      iconColor: "text-blue-700",
      textColor: "text-blue-800",
    },
    {
      title: "Sensores Ativos",
      value: sensorStats.ativos,
      icon: SignalHigh,
      bg: "bg-card",
      iconColor: "text-green-700",
      textColor: "text-green-800",
    },
    {
      title: "Em manutenção",
      value: sensorStats.inativos,
      icon: Wrench,
      bg: "bg-card",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      title: "Alertas",
      value: sensorStats.alertas,
      icon: AlertTriangle,
      bg: "bg-card",
      iconColor: "text-red-700",
      textColor: "text-red-800",
    },
  ];

  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <div className="flex flex-col">
                    <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${card.iconColor}`} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <Card className="mx-auto mt-10">
        <CardHeader>
          <CardTitle>Lista de Sensores</CardTitle>
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
                      <div className="text-sm font-semibold">{sensor.sensor_codigo}</div>
                      <div className="text-[10px] text-foreground/60">ID: {sensor.sensor_id}</div>
                      <div className="text-[10px] text-accent">{sensor.residencia_type}</div>
                    </td>
                    <td className="px-4 py-2 text-sm">{sensor.localizacao || "-"}</td>
                    <td
                      className={`px-4 py-2 text-sm font-bold ${
                        sensor.sensor_status === "ativo"
                          ? "text-green-600"
                          : sensor.sensor_status === "inativo"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {sensor.sensor_status || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm font-bold">
                      {sensor.consumo_total}/L
                      <div className="text-[10px] text-foreground/60">Total Acumulado</div>
                    </td>
                    <td className="px-4 py-2 text-sm font-bold">
                      {sensor.ultimo_envio
                        ? new Date(sensor.ultimo_envio).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                                          <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(sensor)}>
                                            <div className="flex items-center gap-1">
                                              {sensor.sensor_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-red-500" size={14} />}
                                            </div>
                                          </Button>
                                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirmação</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                  Deseja realmente {selectedItem?.sensor_status === "ativo" ? "inativar" : "ativar"} o usuário <strong>{selectedItem?.sensor_codigo}</strong>?
                </p>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={toggleStatus}>{selectedItem?.sensor_status === "ativo" ? "Inativar" : "Ativar"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  );
}
