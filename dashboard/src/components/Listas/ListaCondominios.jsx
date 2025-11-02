"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Building, UserCheck, AlertTriangle, SignalHigh, X, Check, Pencil, UserStar, Droplet, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CondominioFilter from "../Filters/CondominioFilter";
import AnimationWrapper from "../Layout/Animation/Animation";
import { useCondominios } from "@/hooks/useCondominios";

export default function CondominiosDashboard() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condominioStats, setCondominioStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0, sensoresAtivos: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedCondominio, setSelectedCondominio] = useState(null);
 



  const API_URL = "http://localhost:3333/api/condominios";

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);

      const [resAll, resAtivos, resInativos, resCount] = await Promise.all([
        fetch(`${API_URL}`),
        fetch(`${API_URL}/ativos`),
        fetch(`${API_URL}/inativos`),
        fetch(`${API_URL}/count`),
      ]);

      const [dataAll, dataAtivos, dataInativos, dataCount] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
      ]);

      let allCondominios = dataAll.docs || [];

      // Filtragem local
      const filteredCondominios = allCondominios.filter(c => {
        const matchesStatus = filters.status ? c.condominio_status === filters.status : true;
        const matchesNome = filters.nome ? c.condominio_nome.toLowerCase().includes(filters.nome.toLowerCase()) : true;
        return matchesStatus && matchesNome;
      });

      setCondominios(filteredCondominios);

      const alertas = filteredCondominios.filter(c => !c.responsavel_id).length;

      const sensorStats = filteredCondominios.reduce(
        (acc, cond) => {
          // Sensores
          if (cond.sensor_status) {
            acc.sensoresTotal += 1;
            if (cond.sensor_status === "ativo") acc.sensoresAtivos += 1;
            else if (cond.sensor_status === "inativo") acc.sensoresInativos += 1;
            else acc.sensoresAlertas += 1;
          }

          // Total de apartamentos
          acc.apartamentosTotal += cond.numero_apartamentos || 0;
          if (cond.condominio_status === "ativo") {
            acc.apartamentosAtivos += cond.numero_apartamentos || 0;
          }

          // Síndicos
          if (cond.sindico_nome) acc.sindicosAtivos += 1;

          // Total de condomínios
          acc.total += 1;

          return acc;
        },
        {
          total: 0,
          sensoresTotal: 0,
          sensoresAtivos: 0,
          sensoresInativos: 0,
          sensoresAlertas: 0,
          apartamentosTotal: 0,
          apartamentosAtivos: 0,
          sindicosAtivos: 0
        }
      );


      setCondominioStats({
        total: dataCount.total ?? filteredCondominios.length,
        ativos: dataAtivos.docs?.length ?? 0,
        inativos: dataInativos.docs?.length ?? 0,
        alertas,
        sensoresAtivos: sensorStats.ativos,
        sensoresInativos: sensorStats.inativos,
        sensoresTotal: sensorStats.total,
        litrosTotais: sensorStats.litrosTotais
      });

    } catch (err) {
      console.error("Erro ao buscar dados dos condomínios:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  const confirmToggleStatus = (condominio) => {
    setSelectedCondominio(condominio);
    setShowModal(true);
  };


  const toggleStatus = async () => {
    if (!selectedCondominio) return;
    try {
      const action = selectedCondominio.condominio_status === "ativo" ? "inativar" : "ativar";
      const res = await fetch(`${API_URL}/${selectedCondominio.id}/${action}`, { method: "PATCH" });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
      toast.success(`Condomínio ${selectedCondominio.condominio_status === "ativo" ? "inativado" : "ativado"} com sucesso!`);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedCondominio(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Total de Condomínios",
      value: condominioStats.total,
      valueAtivos: { casas: condominioStats.ativos },
      icon: Building,
      bg: "bg-card",
      iconColor: "text-blue-700",
      textColor: "text-blue-800"
    },
    {
      title: "Apartamentos Totais",
      value: condominios.reduce((acc, c) => acc + (c.numero_apartamentos || 0), 0),
      valueAtivos: { casas: condominios.reduce((acc, c) => acc + ((c.condominio_status === "ativo") ? c.numero_apartamentos : 0), 0) },
      icon: Droplet,
      bg: "bg-card",
      iconColor: "text-orange-300",
      textColor: "text-orange-800",

    },
    {
      title: "Sensores Ativos",
      value: condominioStats.sensoresTotal,
      icon: Check,
      iconColor: "text-green-700",
      porcentagem: condominioStats.sensoresTotal > 0
        ? ((condominioStats.sensoresAtivos / condominioStats.sensoresTotal) * 100).toFixed(0) + "% operacionais"
        : "0% operacionais"
    },
    {
      title: "Síndicos Ativos",
      value: condominios.reduce((acc, c) => acc + (c.sindico_nome ? 1 : 0), 0),
      icon: UserStar,
      bg: "bg-card",
      iconColor: "text-purple-700",
      textColor: "text-green-800",
      subTitle: condominios.length > 0
        ? `Média de ${(condominios.reduce((acc, c) => acc + (c.sindico_nome ? 1 : 0), 0) / condominios.length).toFixed(0)} por condomínio`
        : "0"
    }
  ];


  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />
      <div className="mb-10">
        <CondominioFilter onApply={(filters) => fetchData(filters)} />
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
                    {/* Total */}
                    <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>

                    {/* Ativos */}
                    {card.valueAtivos && (
                      <p className="text-sm mt-1 text-blue-600">
                        {card.valueAtivos.casas} ativos
                      </p>
                    )}

                    {/* Porcentagem */}
                    {card.porcentagem && (
                      <p className="text-sm mt-1 text-green-600">{card.porcentagem}</p>
                    )}

                    {/* Subtítulos adicionais */}
                    {card.subTitle && (
                      <p className="text-sm mt-1 text-purple-600">{card.subTitle}</p>
                    )}
                    {card.subTitle2 && (
                      <p className="text-sm mt-1 text-orange-300">{card.subTitle2}</p>
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

        <Card className="mx-auto mt-10">
          <CardHeader>
            <CardTitle>Lista de Condomínios</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {condominios.length === 0 ? (
              <p>Nenhum condomínio encontrado.</p>
            ) : (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Condomínio</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Unidades</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sensores</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Síndicos</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {condominios.map(condominio => (
                    <tr key={condominio.condominio_id} className="hover:bg-muted/10 text-foreground">
                      <td className="px-4 py-2">
                        <div className="text-sm font-semibold">{condominio.condominio_nome}</div>
                        <div className="text-xs text-foreground/80">{`${condominio.logradouro}, ${condominio.numero} - ${condominio.bairro} / ${condominio.uf}`}</div>
                         <div className="text-[10px] text-foreground/60">CEP: {condominio.cep}</div>
                    
                        <div className="text-[10px] text-chart-1">Código {condominio.condominio_codigo}</div>
                        <div className="text-[10px] text-foreground/60">
                          Criado em {new Date(condominio.data_criacao).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">{condominio.numero_apartamentos}/300
                        <div className="text-[10px] text-foreground/60">Total Apartamentos</div>
                      </td>
                      <td className="px-4 py-2 text-sm">{condominio.numero_sensores}/300
                        <div className="text-[10px] text-foreground/60">Total de Sensores</div>
                      </td>
                      <td className="text-sm font-bold flex items-center ml-7 py-9">
                        <span className={`inline-block w-3 h-3 rounded-full px-3 ${condominio.condominio_status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={condominio.condominio_status} />
                      </td>
                      <td className="px-4 py-2 text-sm">{condominio.sindico_nome}</td>
                      <td className="px-4 py-2 text-sm">-</td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(condominio)}>
                            <div className="flex items-center gap-1">
                              {condominio.condominio_status === "ativo" ? (
                                <Check className="text-green-500" size={14} />
                              ) : (
                                <X className="text-red-500" size={14} />
                              )}
                            </div>


                          </Button>

                      
                        </div>
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
            Deseja realmente {selectedCondominio?.condominio_status === "ativo" ? "inativar" : "ativar"} o condomínio <strong>{selectedCondominio?.condominio_nome}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>{selectedCondominio?.condominio_status === "ativo" ? "Inativar" : "Ativar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}
