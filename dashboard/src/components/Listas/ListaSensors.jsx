"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";
import { Cpu, SignalHigh, AlertTriangle } from "lucide-react";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function SensorsDashboard() {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3333/api/sensores");
      const data = await res.json();
      const allSensores = data.docs || [];
      setSensores(allSensores);

      const ativos = allSensores.filter(s => s.status === "ativo");
      const inativos = allSensores.filter(s => s.status === "inativo");
      const alertas = allSensores.filter(s => !["ativo", "inativo"].includes(s.status));

      setSensorStats({
        total: allSensores.length,
        ativos: ativos.length,
        inativos: inativos.length,
        alertas: alertas.length,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    { title: "Total de Sensores", value: sensorStats.total, icon: Cpu, bg: "bg-blue-300" },
    { title: "Sensores Ativos", value: sensorStats.ativos, icon: SignalHigh, bg: "bg-green-300" },
    { title: "Sensores Inativos", value: sensorStats.inativos, icon: AlertTriangle, bg: "bg-red-300" },
    { title: "Sensores com Alerta", value: sensorStats.alertas, icon: AlertTriangle, bg: "bg-yellow-300" },
  ];

  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card className={`p-4 ${card.bg}`}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Icon className="w-10 h-10 mb-2" />
                  <p className="font-bold text-xl">{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <Card className="mx-auto max-w-7xl mt-20">
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
                                                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Conectividade</th>
                                                                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Bateria</th>
                                                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Alertas</th>
                                                                                                                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sensores.map(sensor => (
                  <tr key={sensor.id} className="hover:bg-muted/10 text-foreground">
                    <td className="px-4 py-2 text-sm font-bold">{sensor.codigo}</td>
                    <td className={`px-4 py-2 text-sm font-bold ${
                      sensor.status === "ativo" ? "text-green-600" :
                      sensor.status === "inativo" ? "text-red-600" : "text-yellow-600"
                    }`}>
                      {sensor.status}
                    </td>
                    <td className="px-4 py-2 text-sm">{sensor.localizacao || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
