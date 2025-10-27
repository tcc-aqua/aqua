"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Users, UserCheck, Building, AlertTriangle } from "lucide-react";
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

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    ativos: 0,
    sindicos: 0,
    moradores: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = "http://localhost:3333/api/users";

  const fetchData = async () => {
    try {
      setLoading(true);


      const [resUsers, resTotal, resAtivos, resSindicos, resMoradores] = await Promise.all([
        fetch(`${API_URL}`),
        fetch(`${API_URL}/count`),
        fetch(`${API_URL}/count-ativos`),
        fetch(`${API_URL}/count-sindicos`),
        fetch(`${API_URL}/count-moradores`),
      ]);

      const [dataUsers, dataTotal, dataAtivos, dataSindicos, dataMoradores] =
        await Promise.all([
          resUsers.json(),
          resTotal.json(),
          resAtivos.json(),
          resSindicos.json(),
          resMoradores.json(),
        ]);

      setUsers(dataUsers.docs || dataUsers || []);
      setUserStats({
        total: dataTotal ?? 0,
        ativos: dataAtivos?? 0,
        sindicos: dataSindicos ?? 0,
        moradores: dataMoradores ?? 0,
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

  const confirmToggleStatus = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const toggleStatus = async () => {
    if (!selectedUser) return;
    try {
      const action = selectedUser.status === "ativo" ? "inativar" : "ativar";
      const res = await fetch(`${API_URL}/${selectedUser.id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
      toast.success(
        `Usuário ${selectedUser.status === "ativo" ? "inativado" : "ativado"} com sucesso!`
      );
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Todos os Usuários",
      value: userStats.total,
      icon: Users,
      bg: "bg-card",
      iconColor: "text-blue-700",
      textColor: "text-blue-800",
    },
    {
      title: "Usuários Ativos",
      value: userStats.ativos,
      icon: UserCheck,
      bg: "bg-card",
      iconColor: "text-green-700",
      textColor: "text-green-800",
    },
    {
      title: "Síndicos",
      value: userStats.sindicos,
      icon: Building,
      bg: "bg-card",
      iconColor: "text-yellow-700",
      textColor: "text-yellow-800",
    },
    {
      title: "Moradores",
      value: userStats.moradores,
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
              <Card className={`p-4 ${card.bg}`}>
                <CardHeader>
                  <CardTitle className={`font-bold text-xl ${card.textColor}`}>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Icon className={`w-10 h-10 mb-2 ${card.iconColor}`} />
                  <p className={`font-bold text-xl ${card.textColor}`}>{card.value ?? 0}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <Card className="mx-auto mt-20">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Usuário
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Residência
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Função
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Último acesso
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 text-foreground">
                    <td className="px-4 py-2">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-foreground/80">{user.email}</div>
                      <div className="text-xs text-foreground/60">{user.cpf}</div>
                    </td>

                    <td className="px-4 py-2 text-sm">{user.residencia_id}</td>
                    <td className="px-4 py-2 text-sm">{user.type}</td>
                    <td className="px-4 py-2 text-sm">{user.role}</td>

                    <td className="px-4 py-2 text-sm font-bold flex items-center justify-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mt-3 ${user.status === "ativo" ? "bg-green-600" : "bg-red-600"
                          }`}
                        title={user.status}
                      />
                    </td>

                    <td className="px-4 py-2 text-sm">
                      <div className="text-sm font-semibold">
                        Último acesso{" "}
                        {user.atualizado_em
                          ? new Date(user.atualizado_em).toLocaleString("pt-BR")
                          : "-"}
                      </div>
                      <div className="text-[10px] text-foreground/60">
                        Criado em{" "}
                        {user.criado_em
                          ? new Date(user.criado_em).toLocaleString("pt-BR")
                          : "-"}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-sm text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmToggleStatus(user)}
                      >
                        {user.status === "ativo" ? "Inativar" : "Ativar"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmação */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Deseja realmente{" "}
            {selectedUser?.status === "ativo" ? "inativar" : "ativar"} o usuário{" "}
            <strong>{selectedUser?.name}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={toggleStatus}>
              {selectedUser?.status === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
