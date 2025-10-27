"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Building2, UserCheck, AlertTriangle, SignalHigh, X, Check } from "lucide-react";
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

export default function ApartamentosDashboard() {
    const [apartamentos, setApartamentos] = useState([]);
    const [sensores, setSensores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apStats, setApStats] = useState({ total: 0, ativas: 0, inativas: 0, alertas: 0 });
    const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedAp, setSelectedAp] = useState(null);

    const API_AP = "http://localhost:3333/api/apartamentos";
    const API_SENSORES = "http://localhost:3333/api/sensores";

    const fetchData = async () => {
        try {
            setLoading(true);

            const [resAp, resApAtivos, resApInativos, resApCount, resSensores, resSensoresAtivos, resSensoresCount,] = await Promise.all([
                fetch(`${API_AP}`),
                fetch(`${API_AP}/ativos`),
                fetch(`${API_AP}/inativos`),
                fetch(`${API_AP}/count`),
                fetch(`${API_SENSORES}`),
                fetch(`${API_SENSORES}/ativos`),
                fetch(`${API_SENSORES}/count`),
            ]);

            const [dataAp, dataApAtivos, dataApInativos, dataApCount, dataSensores, dataSensoresAtivos, dataSensoresCount,] = await Promise.all([
                resAp.json(),
                resApAtivos.json(),
                resApInativos.json(),
                resApCount.json(),
                resSensores.json(),
                resSensoresAtivos.json(),
                resSensoresCount.json(),
            ]);

            const allAp = dataAp.docs || [];
            const allSensores = dataSensores.docs || [];

            setApartamentos(allAp);
            setSensores(allSensores);

            const alertas = allAp.filter(a => !a.numero_moradores || a.numero_moradores === 0);

            setApStats({
                total: dataApCount ?? 0,
                ativas: dataApAtivos.docs?.length ?? 0,
                inativas: dataApInativos.docs?.length ?? 0,
                alertas: alertas.length,
            });

            const sensoresVinculados = allSensores.filter(s =>
                allAp.some(a => a.sensor_id === s.id)
            );

            const sensoresAtivos = sensoresVinculados.filter(s => s.status === "ativo");
            const sensoresInativos = sensoresVinculados.filter(s => s.status === "inativo");
            const sensoresComAlerta = sensoresVinculados.filter(s => s.consumo_total > 1000);

            setSensorStats({
                total: sensoresVinculados.length,
                ativos: sensoresAtivos.length,
                inativos: sensoresInativos.length,
                alertas: sensoresComAlerta.length,
            });
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const confirmToggleStatus = (ap) => {
        setSelectedAp(ap);
        setShowModal(true);
    };

    const toggleStatus = async () => {
        if (!selectedAp) return;
        try {
            const action = selectedAp.status === "ativo" ? "inativar" : "ativar";
            const res = await fetch(`${API_AP}/${selectedAp.id}/${action}`, { method: "PATCH" });
            if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
            toast.success(`Apartamento ${selectedAp.status === "ativo" ? "inativado" : "ativado"} com sucesso!`);
            fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setShowModal(false);
            setSelectedAp(null);
        }
    };

    if (loading) return <Loading />;
    if (error) return <p className="text-red-500">Erro: {error}</p>;

    const cards = [
        {
            title: "Total de Apartamentos",
            value: apStats.total,
            icon: Building2,
            bg: "bg-card",
            iconColor: "text-blue-700",
            textColor: "text-blue-800"
        },
        {
            title: "Apartamentos Ativos",
            value: apStats.ativas,
            icon: UserCheck,
            bg: "bg-card",
            iconColor: "text-green-700",
            textColor: "text-green-800"
        },
        {
            title: "Sensores Ativos",
            value: sensorStats.ativos,
            icon: SignalHigh,
            bg: "bg-card",
            iconColor: "text-green-700",
            textColor: "text-green-800"
        },
        {
            title: "Alertas",
            value: apStats.alertas,
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
                            <Card className={`p-4 ${card.bg}`}>
                                <CardHeader>
                                    <CardTitle className={`font-bold text-xl ${card.textColor}`}>{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <Icon className={`w-10 h-10 mb-2 ${card.iconColor}`} />
                                    <p className={`font-bold text-xl ${card.textColor}`}>{card.value}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </section>

            <Card className="mx-auto mt-10 max-w-7xl">
                <CardHeader>
                    <CardTitle>Lista de Apartamentos</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {apartamentos.length === 0 ? (
                        <p>Nenhum apartamento encontrado.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Unidade</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Morador Principal</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sensor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Consumo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {apartamentos.map(ap => {
                                    const sensor = sensores.find(s => s.id === ap.sensor_id);
                                    return (
                                        <tr key={ap.id} className="hover:bg-muted/10 text-foreground">
                                            <td className="px-4 py-2 ">
                                                <div className="text-sm font-semibold">{`Bloco ${ap.bloco} - ${ap.numero}`}</div>
                                                <div className="text-xs text-foreground/80">{`${ap.numero_moradores || 0} Moradores`}</div>
                                                <div className="text-[10px] text-foreground/60 ">
                                                    Criado em {new Date(ap.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-sm">{ap.morador_principal || "-"}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <div>{sensor ? sensor.codigo : "-"}</div>
                                                {sensor && (
                                                    <div className="ml-3 text-sm font-bold">
                                                        <span className={sensor.status === "ativo" ? "text-green-600" : "text-red-600"}>
                                                            {sensor.status === "ativo" ? "Ativo" : "Inativo"}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-foreground/60">
                                                    Último envio: {sensor?.ultimo_envio
                                                        ? new Date(sensor.ultimo_envio).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                                        : "-"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-sm">{sensor?.consumo_total || 0}L/dia</td>
                                            <td className=" text-sm font-bold flex items-center ml-7 ">
                                                <span className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${ap.status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={ap.status} />
                                            </td>
                                            <td className="px-4 py-2 text-sm">-</td>
                                            <td className="px-4 py-2 text-sm">
                                                  <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(ap)}>

                                                        <div className="flex items-center gap-1">
                                                            {ap.status === "ativo" ? (
                                                                <>
                                                                    <Check className="text-green-500" size={14} />

                                                                </>
                                                            ) : (
                                                                <>
                                                                    <X className="text-red-500" size={14} />

                                                                </>
                                                            )}
                                                        </div>
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
                        Deseja realmente {selectedAp?.status === "ativo" ? "inativar" : "ativar"} o apartamento <strong>Bloco {selectedAp?.bloco} - {selectedAp?.numero}</strong>?
                    </p>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={toggleStatus}>{selectedAp?.status === "ativo" ? "Inativar" : "Ativar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
