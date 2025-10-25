"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Building, UserCheck, AlertTriangle } from "lucide-react";
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

export default function CondominiosDashboard() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condominioStats, setCondominioStats] = useState({ total: 0, ativos: 0, inativos: 0, alertas: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedCondominio, setSelectedCondominio] = useState(null);

  const fetchData = async () => {
    try {
      const resAll = await fetch("http://localhost:3333/api/condominios");
      const dataAll = await resAll.json();
      const allCondominios = dataAll.docs || [];
      setCondominios(allCondominios);

      const ativos = allCondominios.filter(c => c.ativo);
      const inativos = allCondominios.filter(c => !c.ativo);
      const alertas = allCondominios.filter(c => !c.responsavel_id);

      setCondominioStats({
        total: allCondominios.length,
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

  const confirmToggleStatus = (condominio) => {
    setSelectedCondominio(condominio);
    setShowModal(true);
  };

  const toggleStatus = async () => {
    if (!selectedCondominio) return;
    try {
      const action = selectedCondominio.ativo ? "inativar" : "ativar";
      const res = await fetch(`http://localhost:3333/api/condominios/${selectedCondominio.id}/${action}`, { method: "PATCH" });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
      toast.success(`Condomínio ${selectedCondominio.ativo ? "inativado" : "ativado"} com sucesso!`);
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
    { title: "Total de Condomínios", value: condominioStats.total, icon: Building, bg: "bg-blue-300" },
    { title: "Ativos", value: condominioStats.ativos, icon: UserCheck, bg: "bg-green-300" },
    { title: "Inativos", value: condominioStats.inativos, icon: AlertTriangle, bg: "bg-red-300" },
    { title: "Sem Responsável", value: condominioStats.alertas, icon: AlertTriangle, bg: "bg-yellow-300" },
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
          <CardTitle>Lista de Condomínios</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {condominios.length === 0 ? (
            <p>Nenhum condomínio encontrado.</p>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Condomínio</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Unidades</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Sensores</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Síndicos</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Alertas</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {condominios.map(condominio => (
                  <tr key={condominio.id} className="hover:bg-muted/10 text-foreground">
                    <td className="px-4 py-2 text-sm font-bold">{condominio.name}</td>
                    <td className="px-4 py-2 text-sm">{condominio.criado_em || "-"}</td>
                    <td className="px-4 py-2 text-sm">{condominio.atualizado_em || "-"}</td>
                    <td className="px-4 py-2 text-sm">{condominio.responsavel_id || "-"}</td>
                    <td className={`px-4 py-2 text-sm font-bold ${condominio.ativo ? "text-green-600" : "text-red-600"}`}>
                      {condominio.ativo ? "Ativo" : "Inativo"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant={condominio.ativo ? "destructive" : "outline"}
                        onClick={() => confirmToggleStatus(condominio)}
                      >
                        {condominio.ativo ? "Inativar" : "Ativar"}
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
            Deseja realmente {selectedCondominio?.ativo ? "inativar" : "ativar"} o condomínio{" "}
            <strong>{selectedCondominio?.name}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>
              {selectedCondominio?.ativo ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
