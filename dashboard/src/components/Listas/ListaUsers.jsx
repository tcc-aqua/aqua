"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Users, UserCheck, UserCog, AlertTriangle, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";
import UserFilter from "../Filters/Usuarios";


const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
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

  const API_URL = "http://localhost:3333/api/users";

  const fetchData = async () => {
    try {
      setLoading(true);

      const [resUsers, resTotal, resAtivos, resSindicos, resMoradores] = await Promise.all([
        fetch(`${API_URL}`),
        fetch(`${API_URL}/count`),
        fetch(`${API_URL}/count-ativos`),
        fetch(`${API_URL}/sindicos`),
        fetch(`${API_URL}/moradores`)
      ]);

      const [dataUsers, dataTotal, dataAtivos, dataSindicos, dataMoradores] = await Promise.all([
        resUsers.json(),
        resTotal.json(),
        resAtivos.json(),
        resSindicos.json(),
        resMoradores.json(),
      ]);

      setUsers(dataUsers.docs ?? dataUsers ?? []);
      setUserStats({
        total: dataTotal ?? 0,
        ativos: dataAtivos ?? 0,
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




  const { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus } = useToggleConfirm(API_URL, fetchData);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const cards = [
    {
      title: "Todos os Usuários",
      value: userStats.total,
      icon: Users,
      iconColor: "text-blue-700", 
    },
    { title: "Usuários Ativos",
       value: userStats.ativos,
        icon: UserCheck, 
     
        iconColor: "text-green-700", 
       },
    { title: "Síndicos",
       value: userStats.sindicos,
        icon: UserCog,
         iconColor: "text-yellow-500",
         },
    { title: "Alertas",
       value: userStats.moradores,
        icon: AlertTriangle,
         iconColor: "text-red-700", 
         },
  ];

  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />
    

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={cardVariants} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <p className="font-bold text-4xl text-foreground ">{card.value ?? 0}</p>
                  <Icon className={`w-10 h-10   ${card.iconColor}`}
                  />
                </CardContent>

              </Card>
            </motion.div>
          );
        })}
      </section>

      <Card className="mx-auto mt-10 ">
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
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Usuário</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase"> Residência </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Função</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase"> Último acesso</th>
                  {/* <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th> */}
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase"> Ações</th>
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
                    <td className="px-4 py-2 text-sm">{user.endereco}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-semibold ${user.type === "casa"
                            ? "bg-blue-700"
                            : user.type === "condominio"
                              ? "bg-purple-700"
                              : "bg-gray-500"
                          }`}
                      >
                        {user.type === "casa" ? "casa" : user.type === "condominio" ? "condomínio" : "Desconhecido"}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-semibold ${user.role === "morador"
                            ? "bg-green-600"
                            : user.role === "sindico"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                      >
                        {user.role === "morador" ? "morador" : user.role === "sindico" ? "síndico" : "Desconhecido"}
                      </span>
                    </td>



                    <td className=" text-sm font-bold flex items-center px-7 py-4">
                      <span className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${user.status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={user.status} />
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="text-xs font-semibold">
                        {user.atualizado_em ? new Date(user.atualizado_em).toLocaleString("pt-BR") : "-"}
                      </div>
                      <div className="text-[10px] text-foreground/60">
                        Criado em {user.criado_em ? new Date(user.criado_em).toLocaleString("pt-BR") : "-"}
                      </div>
                    </td>
                    {/* <td className="px-4 py-2 text-sm"></td> */}
                    <td className="px-4 py-2 text-sm text-center">
                      <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(user)}>
                        <div className="flex items-center gap-1">
                          {user.status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-red-500" size={14} />}
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
            Deseja realmente {selectedItem?.status === "ativo" ? "inativar" : "ativar"} o usuário <strong>{selectedItem?.name}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>{selectedItem?.status === "ativo" ? "Inativar" : "Ativar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
