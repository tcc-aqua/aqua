"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Home, UserCheck, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function CasasDashboard() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [casaStats, setCasaStats] = useState({ total: 0, ativas: 0, inativas: 0, alertas: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [sensores, setSensores] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3333/api/casas");
      const data = await res.json();
      const allCasas = data.docs || [];
      setCasas(allCasas);

      const resSensores = await fetch("http://localhost:3333/api/sensores");
      const dataSensores = await resSensores.json();
      const allSensores = dataSensores.docs || [];
      setSensores(allSensores);

      const ativas = allCasas.filter(c => c.status === "ativo");
      const inativas = allCasas.filter(c => c.status === "inativo");
      const alertas = allCasas.filter(c => !c.numero_moradores || c.numero_moradores === 0);

      setCasaStats({
        total: allCasas.length,
        ativas: ativas.length,
        inativas: inativas.length,
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

  const confirmToggleStatus = (casa) => {
    setSelectedCasa(casa);
    setShowModal(true);
  };

  const toggleStatus = async () => {
    if (!selectedCasa) return;
    try {
      const action = selectedCasa.status === "ativo" ? "inativar" : "ativar";
      const res = await fetch(`http://localhost:3333/api/casas/${selectedCasa.id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
      toast.success(`Casa ${selectedCasa.status === "ativo" ? "inativada" : "ativada"} com sucesso!`);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedCasa(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    { title: "Total de Casas", value: casaStats.total, icon: Home, bg: "bg-blue-300" },
    { title: "Casas Ativas", value: casaStats.ativas, icon: UserCheck, bg: "bg-green-300" },
    { title: "Casas Inativas", value: casaStats.inativas, icon: AlertTriangle, bg: "bg-red-300" },
    { title: "Alertas Ativos", value: casaStats.alertas, icon: AlertTriangle, bg: "bg-yellow-300" },
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
          <CardTitle>Lista de Casas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {casas.length === 0 ? (
            <p>Nenhuma casa encontrada.</p>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Casa</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Morador Principal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Sensor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Consumo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Alertas</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {casas.map(casa => {
                  const sensor = sensores.find(s => s.id === casa.sensor_id);
                  return (
                    <tr key={casa.id} className="hover:bg-muted/10 text-foreground">
                      <td className="px-4 py-2 ">
                        <div className="text-sm">{`${casa.logradouro}, ${casa.numero} - ${casa.bairro}`}</div>
                        <div className="text-xs ">{`${casa.numero_moradores || 0} Moradores`}</div>
                        </td>
                      <td className="px-4 py-2 text-sm">-</td>
                      <td className="px-4 py-2 text-sm"><div>{sensor ? `${sensor.codigo}` : "-"}</div>
                      
                      <div className={`ml-3 text-sm font-bold ${sensor.status === "ativo" ? "text-green-600" : sensor.status === "inativo" ? "text-red-600" : "text-yellow-600"}`}>
                        {sensor ? `${sensor.status === "ativo" ? "Ativo" : "Inativo"}` : "-"}</div> 
                        </td>
                      <td className="px-4 py-2 text-sm">{sensor?.consumo_total || 0}</td>
                     <td className="px-4 py-2 text-sm font-bold flex items-center ml-5">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mt-3 ${casa.status === "ativo" ? "bg-green-600" : "bg-red-600"}`}
                        title={casa.status}
                      />
                    </td>
                      <td className="px-4 py-2 text-sm">{!casa.numero_moradores || casa.numero_moradores === 0 ? "-" : "-"}</td>
                      <td className="px-4 py-2 text-sm">
                        <Button
                          size="sm"
                          variant={casa.status === "ativo" ? "destructive" : "outline"}
                          onClick={() => confirmToggleStatus(casa)}
                        >
                          {casa.status === "ativo" ? "Inativar" : "Ativar"}
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Deseja realmente {selectedCasa?.status === "ativo" ? "inativar" : "ativar"} a casa{" "}
            <strong>{selectedCasa?.logradouro}, {selectedCasa?.numero}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>
              {selectedCasa?.status === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
