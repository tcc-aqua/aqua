"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Building2, UserCheck, AlertTriangle, SignalHigh, X, Check, Pencil } from "lucide-react";
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


export default function ApartamentosDashboard() {
    const [apartamentos, setApartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apStats, setApStats] = useState({ total: 0, ativas: 0, inativas: 0, alertas: 0 });
    const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });

const API_AP = `${process.env.NEXT_PUBLIC_API_URL}/apartamentos`;


    const fetchData = async (filters = {}) => {
        try {
            setLoading(true);

            const [resAll, resAtivos, resInativos, resCount] = await Promise.all([
                fetch(`${API_AP}`),
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

            // Filtragem local
            let filteredAps = allData.docs || [];
            if (filters.status) {
                filteredAps = filteredAps.filter(ap => ap.apartamento_status === filters.status);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                filteredAps = filteredAps.filter(ap =>
                    ap.endereco_completo.toLowerCase().includes(search) ||
                    (ap.responsavel_nome?.toLowerCase().includes(search))
                );
            }

            setApartamentos(filteredAps);

            // Estatísticas apartamentos
            const apStats = filteredAps.reduce(
                (acc, a) => {
                    acc.total++;
                    if (a.apartamento_status === "ativo") acc.ativas++;
                    else acc.inativas++;
                    if (!a.responsavel_id) acc.alertas++;
                    return acc;
                },
                { total: 0, ativas: 0, inativas: 0, alertas: 0 }
            );
            setApStats(apStats);

            // Estatísticas sensores
            const sensorStats = filteredAps.reduce(
                (acc, ap) => {
                    if (ap.sensor_id) acc.total++;
                    if (ap.sensor_status === "ativo") acc.ativos++;
                    else if (ap.sensor_status) acc.inativos++;
                    if (!ap.sensor_id) acc.alertas++;
                    return acc;
                },
                { total: 0, ativos: 0, inativos: 0, alertas: 0 }
            );
            setSensorStats(sensorStats);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const { showModal, setShowModal, selectedItem: selectedAp, confirmToggleStatus, toggleStatus } =
        useToggleConfirm(API_AP, fetchData);

    useEffect(() => {
        fetchData();
    }, []);


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
            value: apStats.total,
            valueAtivas: apStats.ativas,
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
            <div className="mb-10">
                <ApartamentoFilter onApply={(filters) => fetchData(filters)} />
            </div>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (

                        <AnimationWrapper key={card.title} delay={i * 0.2}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row items-center justify-between -mt-6">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                                        {card.valueAtivas && (
                                            <p className="text-green-600 text-sm mt-1">{card.valueAtivas} Ativos</p>
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


                <Card className="mx-auto mt-10 ">
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
                                    {apartamentos.map(ap => (
                                        <tr key={ap.apartamento_id} className="hover:bg-muted/10 text-foreground">
                                            <td className="px-4 py-2 ">
                                                <div className="text-sm font-semibold">Bloco {ap.endereco_completo}</div>
                                                <div className="text-xs text-foreground/80">{ap.endereco_condominio}</div>
                                                <div className="text-xs text-foreground/80">{`${ap.numero_moradores || 0} Moradores`}</div>
                                                <div className="text-[10px] text-chart-1">Código {ap.apartamento_codigo}</div>


                                            </td>
                                            <td className="px-4 py-2 text-sm">{ap.responsavel_nome}
                                                <div className="text-xs text-foreground/80">{ap.responsavel_email}</div>
                                                <div className="text-xs text-foreground/60">{ap.responsavel_cpf}</div>
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                <div className="font-bold">{ap.sensor_codigo}</div>
                                                <div className="text-sm font-bold">
                                                    <span className={ap.sensor_status === "ativo" ? "text-green-600" : "text-red-600"}>
                                                        {ap.sensor_status === "ativo" ? "Ativo" : "Inativo"}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-foreground/60">ID : {ap.sensor_id}</div>
                                                <div className="text-[10px] text-foreground/60">
                                                    Último envio: {ap.ultimo_envio
                                                        ? new Date(ap.ultimo_envio).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                                        : "-"}
                                                </div>


                                            </td>
                                            <td className="px-4 py-2 text-sm font-bold">{ap.consumo_total || 0}L
                                                <div className="text-[10px] text-foreground/60">Total Acumulado</div>
                                            </td>
                                            <td className="text-sm font-bold flex items-center ml-7 py-9 ">
                                                <span className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${ap.apartamento_status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={ap.apartamento_status} />
                                            </td>
                                            <td className="px-4 py-2 text-sm">-</td>
                                            <td className="px-4 py-2 text-sm">
                                                <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(ap)}>
                                                    <div className="flex items-center gap-1">
                                                        {ap.apartamento_status === "ativo" ? (
                                                            <Check className="text-green-500" size={14} />
                                                        ) : (
                                                            <X className="text-red-500" size={14} />
                                                        )}
                                                    </div>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSelectedApartamento(ap)}
                                                >
                                                    <Pencil size={14} className="text-blue-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </AnimationWrapper>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmação</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                        Deseja realmente {selectedAp?.apartamento_status === "ativo" ? "inativar" : "ativar"} o apartamento <strong>{selectedAp?.endereco_completo}</strong>?
                    </p>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={toggleStatus}>{selectedAp?.apartamento_status === "ativo" ? "Inativar" : "Ativar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    );
}
