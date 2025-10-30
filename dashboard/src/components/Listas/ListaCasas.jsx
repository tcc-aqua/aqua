"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Home, HousePlug, AlertTriangle, SignalHigh, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

export default function CasasDashboard() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [casaStats, setCasaStats] = useState({ total: 0, ativas: 0, inativas: 0, alertas: 0 });
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });

  const API_CASAS = "http://localhost:3333/api/casas";

const fetchData = async () => {
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

    setCasas(allData.docs || []);

   

setCasaStats({
  total: countData.total ?? allData.docs.length,
  ativas: countAtivasData.total ?? ativosData.docs?.length ?? 0,
  inativas: inativosData.docs?.length ?? 0,
  alertas: 0, 
});

const sensorStats = allData.docs.reduce((acc, casa) => {
  if (casa.sensor_id) acc.total++;
  if (casa.sensor_status === "ativo") acc.ativos++;
  else if (casa.sensor_status) acc.inativos++;
  return acc;
}, { total: 0, ativos: 0, inativos: 0, alertas: 0 });

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
    valueTotal: casaStats.total,
    valueAtivas: casaStats.ativas,
    icon: Home,
    bg: "bg-card",
    iconColor: "text-blue-700",
    textColor: "text-blue-800"
  },
  {
    title: "Total de Moradores",
    valueTotal: casas.reduce((acc, c) => acc + (c.numero_moradores || 0), 0), // soma moradores
    icon: HousePlug,
    bg: "bg-card",
    iconColor: "text-green-700",
    textColor: "text-green-800"
  },
  {
    title: "Sensores Ativos",
    valueTotal: sensorStats.ativos,
    icon: SignalHigh,
    bg: "bg-card",
    iconColor: "text-green-700",
    textColor: "text-green-800"
  },
  {
    title: "Alertas",
    valueTotal: casaStats.alertas,
    icon: AlertTriangle,
    bg: "bg-card",
    iconColor: "text-red-700",
    textColor: "text-red-800"
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
                    <p className="font-bold text-4xl text-foreground">{card.valueTotal ?? 0}</p>
                    {card.valueAtivas && (
                      <p className="text-green-600 text-sm mt-1">
                        {card.valueAtivas} Ativas
                      </p>
                    )}
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
          <CardTitle>Lista de Casas</CardTitle>
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
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th>
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
                    <td className="px-4 py-2 text-sm">{casa.responsavel_nome}</td>
                    <td className="px-4 py-2 text-sm">
                      <div>{casa.sensor_codigo}</div>
                      <div className=" text-sm font-bold">
                        <span className={casa.sensor_status === "ativo" ? "text-green-600" : "text-red-600"}>
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
                    <td className="px-6 py-2 text-sm">{casa.consumo_total || 0}L
                       <div className="text-[10px] text-foreground/60">Total Acumulado</div>
                    </td>
                    <td className="text-sm font-bold flex items-center ml-7 py-10">
                      <span className={`inline-block w-3 h-3 rounded-full  px-3 ${casa.casa_status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={casa.casa_status} />
                    </td>
                    <td className="px-4 py-2 text-sm">-</td>
                    <td className="px-4 py-2 text-sm">
                      <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(casa)}>
                        <div className="flex items-center gap-1">
                          {casa.casa_status === "ativo" ? (
                            <Check className="text-green-500" size={14} />
                          ) : (
                            <X className="text-red-500" size={14} />
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
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Deseja realmente {selectedItem?.status === "ativo" ? "inativar" : "ativar"} a casa{" "}
            <strong>{selectedItem?.endereco_completo}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>
              {selectedItem?.casa_status === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
