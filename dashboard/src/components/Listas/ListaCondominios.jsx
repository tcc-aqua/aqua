"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Building, UserCheck, AlertTriangle, SignalHigh, X, Check, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";
import useCreateUpdate from "@/hooks/useUpdate";


const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};


export default function CondominiosDashboard() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condominioStats, setCondominioStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCondominio, setSelectedCondominio] = useState(null);
  const [editData, setEditData] = useState({ name: "", logradouro: "", numero: "", bairro: "", cep: "", uf: "" });

  const API_CONDOMINIOS = "http://localhost:3333/api/condominios";


  const fetchData = async () => {
    try {
      setLoading(true);

      const [resAll, resAtivos, resInativos, resCount] = await Promise.all([
        fetch(`${API_CONDOMINIOS}`),
        fetch(`${API_CONDOMINIOS}/ativos`),
        fetch(`${API_CONDOMINIOS}/inativos`),
        fetch(`${API_CONDOMINIOS}/count`),
      ]);

      const [dataAll, dataAtivos, dataInativos, dataCount] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
      ]);

      const allCondominios = dataAll.docs || [];
      setCondominios(allCondominios);

      const alertas = allCondominios.filter(c => !c.responsavel_id);

      setCondominioStats({
        total: dataCount ?? 0,
        ativos: dataAtivos.docs?.length ?? 0,
        inativos: dataInativos.docs?.length ?? 0,
        alertas: alertas.length,
      });
    } catch (err) {
      console.error("Erro ao buscar dados dos condomínios:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus } =
    useToggleConfirm(API_CONDOMINIOS, fetchData);

  const { createItem, updateItem, } = useCreateUpdate(API_CONDOMINIOS, fetchData);
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (condominio) => {
    setSelectedCondominio(condominio);
    setEditData({
      name: condominio.name,
      logradouro: condominio.logradouro,
      numero: condominio.numero,
      bairro: condominio.bairro,
      uf: condominio.uf,
    });
    setShowEditModal(true);
  }

  const handleSaveEdit = async () => {
    try {
      await updateItem(selectedCondominio.id, editData);
      setShowEditModal(false);
    } catch (err) {
      toast.error("Erro ao salvar alterações.");
      console.error(err);
    }
  }

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    { title: "Total de Condomínios", value: condominioStats.total, icon: Building, bg: "bg-card", iconColor: "text-blue-700", textColor: "text-blue-800" },
    { title: "Condomínios Ativos", value: condominioStats.ativos, icon: UserCheck, bg: "bg-card", iconColor: "text-green-700", textColor: "text-green-800" },
    { title: "Sensores Ativos", value: condominioStats.inativos, icon: SignalHigh, bg: "bg-card", iconColor: "text-green-700", textColor: "text-green-800" },
    { title: "Alertas", value: condominioStats.alertas, icon: AlertTriangle, bg: "bg-card", iconColor: "text-red-600", textColor: "text-red-800" },
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
                  <tr key={condominio.id} className="hover:bg-muted/10 text-foreground">
                    <td className="px-4 py-2">
                      <div className="text-sm font-semibold">{condominio.name}</div>
                      <div className="text-xs text-foreground/80">{`${condominio.logradouro}, ${condominio.numero} - ${condominio.bairro} - ${condominio.uf}`}</div>
                      <div className="text-[10px] text-foreground/60">{condominio.cep}</div>
                      <div className="text-[10px] text-foreground/60">
                        Criado em {new Date(condominio.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm">{"-"}</td>
                    <td className="px-4 py-2 text-sm">{"-"}</td>
                    <td className="text-sm font-bold flex items-center ml-7">
                      <span className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${condominio.status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={condominio.status} />
                    </td>
                    <td className="px-4 py-2 text-sm"></td>
                    <td className="px-4 py-2 text-sm">{"-"}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(condominio)}>
                          <div className="flex items-center gap-1">
                            {condominio.status === "ativo" ? (
                              <Check className="text-green-500" size={14} />
                            ) : (
                              <X className="text-red-500" size={14} />
                            )}
                          </div>
                        </Button>
                        <Button size="sm" variant='ghost' onClick={() => useCreateUpdate(API_CONDOMINIOS, fetchData)}>
                          <Pencil />
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Deseja realmente {selectedItem?.status === "ativo" ? "inativar" : "ativar"} o condomínio <strong>{selectedItem?.name}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>
              {selectedItem?.status === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* edit */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Condomínio</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <input
              type="text"
              className="w-full border  rounded p-2"
              placeholder="Nome"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <input type="text"
              className="w-full border  rounded p-2"
              placeholder="Logradouro"
              value={editData.logradouro}
              onChange={(e) => setEditData({ ...editData, logradouro: e.target.value })}
            />
            <input type="text"
              className="w-full border  rounded p-2"
              placeholder="Número"
              value={editData.numero}
              onChange={(e) => setEditData({ ...editData, numero: e.target.value })}
            />
            <input type="text"
              className="w-full border  rounded p-2"
              placeholder="Bairro"
              value={editData.bairro}
              onChange={(e) => setEditData({ ...editData, bairro: e.target.value })}

            />
            <input type="text"
              className="w-full border  rounded p-2"
              placeholder="UF"
              value={editData.uf}
              onChange={(e) => setEditData({ ...editData, uf: e.target.value })}
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => handleEdit(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
