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
const fetchData = async (filters = {}) => {
  try {
    setLoading(true);

    const res = await fetch(`${API_URL}`);
    const data = await res.json();

    // Pega o array correto
    const usersArray = Array.isArray(data) ? data : data.users ?? data.docs ?? [];

    // Aplica os filtros no frontend
    const filteredUsers = usersArray.filter((user) => {
      const matchesSearch = filters.search
        ? user.user_name.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesStatus = filters.status
        ? user.user_status === filters.status
        : true;
      const matchesRole = filters.role
        ? user.user_role === filters.role
        : true;
      const matchesType = filters.type
        ? user.user_type === filters.type
        : true;

      return matchesSearch && matchesStatus && matchesRole && matchesType;
    });

    setUsers(filteredUsers);

    // Atualiza stats
    setUserStats({
      total: filteredUsers.length,
      ativos: filteredUsers.filter(u => u.user_status === "ativo").length,
      inativos: filteredUsers.filter(u => u.user_status === "inativo").length,
      sindicos: filteredUsers.filter(u => u.user_role === "sindico").length,
      moradores: filteredUsers.filter(u => u.user_role === "morador").length,
      casas: filteredUsers.filter(u => u.user_type === "casa").length,
      condominios: filteredUsers.filter(u => u.user_type === "condominio").length,
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
    {
      title: "Usuários Ativos",
      value: userStats.ativos,
      icon: UserCheck,

      iconColor: "text-green-700",
    },
    {
      title: "Síndicos",
      value: userStats.sindicos,
      icon: UserCog,
      iconColor: "text-yellow-500",
    },
    {
      title: "Alertas",
      value: userStats.moradores,
      icon: AlertTriangle,
      iconColor: "text-red-700",
    },
  ];

  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />
 
 <div className="mb-10">
      <UserFilter onApply={(filters) => fetchData(filters)} />
    </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
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


                  <th className="px-4 py-2 text-left text-xs font-medium uppercase"> Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-muted/10 text-foreground">
                    <td className="px-4 py-2">
                      <div className="text-sm font-semibold">{user.user_name}</div>
                      <div className="text-xs text-foreground/80">{user.user_email}</div>
                      <div className="text-xs text-foreground/60">{user.user_cpf}</div>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {user.user_type === "casa" ? (
                        <>
                         {user.logradouro}, {user.numero}
                        </>
                      ) : (
                        <>
                        Bloco {user.logradouro}, {user.numero}
                        </>
                      )
                      }
                      <div className="text-xs text-foreground/80">{user.bairro}, {user.cidade} / {user.uf}</div>
                      <div className="text-[10px] text-foreground/60">CEP: {user.cep}</div>

                    </td>
                    <td className=" text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-semibold ${user.user_type === "casa"
                          ? "bg-blue-700"
                          : user.user_type === "condominio"
                            ? "bg-purple-700"
                            : "bg-gray-500"
                          }`}
                      >
                        {user.user_type === "casa" ? "casa" : user.user_type === "condominio" ? "condomínio" : "Desconhecido"}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-white font-semibold  ${user.user_role === "morador"
                          ? "bg-green-600"
                          : user.user_role === "sindico"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                          }`}
                      >
                        {user.user_role === "morador" ? "morador" : user.user_role === "sindico" ? "síndico" : "Desconhecido"}
                      </span>
                    </td>



                    <td className=" text-sm font-bold flex items-center px-7 py-4">
                      <span className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${user.user_status === "ativo" ? "bg-green-600" : "bg-red-600"}`} title={user.user_status} />
                    </td>

                    <td className="px-4 py-2 text-sm text-center">
                      <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(user)}>
                        <div className="flex items-center gap-1">
                          {user.user_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-red-500" size={14} />}
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
            Deseja realmente {selectedItem?.user_status === "ativo" ? "inativar" : "ativar"} o usuário <strong>{selectedItem?.user_name}</strong>?
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={toggleStatus}>{selectedItem?.user_status === "ativo" ? "Inativar" : "Ativar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
