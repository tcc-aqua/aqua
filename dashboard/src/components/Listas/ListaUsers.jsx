"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Users, UserCheck, UserCog, AlertTriangle, X, Check, Pencil, XCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useToggleConfirm from "@/hooks/useStatus";
import UserFilter from "../Filters/Users";
import AnimationWrapper from "../Layout/Animation/Animation";



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

      const [resAll, resAtivos, resInativos, resCount, resCountAtivas, resSindicos, resMoradores] = await Promise.all([
        fetch(`${API_URL}`),
        fetch(`${API_URL}/ativos`),
        fetch(`${API_URL}/inativos`),
        fetch(`${API_URL}/count`),
        fetch(`${API_URL}/count-ativos`),
        fetch(`${API_URL}/sindicos`),
        fetch(`${API_URL}/moradores`)
      ]);

      if (!resAll.ok || !resAtivos.ok || !resInativos.ok || !resCount.ok || !resCountAtivas.ok || !resSindicos.ok || !resMoradores.ok) {
        throw new Error("Erro ao buscar dados dos usuários.");
      }

      const [allData, ativosData, inativosData, countData, countAtivasData, sindicosData, moradoresData] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
        resCountAtivas.json(),
        resSindicos.json(),
        resMoradores.json()
      ]);

      const usersArray = Array.isArray(allData) ? allData : allData.docs || allData.users || [];
      console.log("usersArray:", usersArray);

      const filteredUsers = usersArray.filter(user => {
        const matchesSearch = filters.search
          ? user.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (user.user_email?.toLowerCase().includes(filters.search.toLowerCase()))
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


      setUserStats({
        total: countData.total ?? usersArray.length,
        ativos: countAtivasData.total ?? ativosData.docs?.length ?? filteredUsers.filter(u => u.user_status === "ativo").length,
        inativos: inativosData.docs?.length ?? 0,
        sindicos: sindicosData.total ?? 0,
        moradores: moradoresData.total ?? 0,
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
  if (error) return <p className="text-destructive">Erro: {error}</p>;


  const cards = [
    {
      title: "Todos os Usuários",
      value: userStats.total,
      icon: Users,
      iconColor: "text-accent",
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
      iconColor: "text-destructive",
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

            <AnimationWrapper key={card.title} delay={i * 0.2}>
              <Card className=" hover:border-sky-400 dark:hover:border-sky-600">
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <p className="font-bold text-4xl text-foreground ">{card.value ?? 0}</p>
                  <Icon className={`w-8 h-8 ${card.iconColor}`}
                  />
                </CardContent>

              </Card>
            </AnimationWrapper>
          );
        })}
      </section>

      <AnimationWrapper delay={0.3}>


        <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-600 ">
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
                    <th className="px-4 py-2 text-center text-xs font-medium uppercase"> Ações</th>
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
                            ? "bg-accent/60"
                            : user.user_type === "condominio"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                            }`}
                        >
                          {user.user_type === "casa" ? "casa" : user.user_type === "condominio" ? "condomínio" : "desconhecido"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-white font-semibold  ${user.user_role === "morador"
                            ? "bg-popover-foreground/70"
                            : user.user_role === "sindico"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                            }`}
                        >
                          {user.user_role === "morador" ? "morador" : user.user_role === "sindico" ? "síndico" : "Desconhecido"}
                        </span>
                      </td>
                      <td className=" text-sm font-bold flex items-center px-9 py-4">
                        <span className={`inline-block w-3 h-3 rounded-full mt-3  ${user.user_status === "ativo" ? "bg-green-600" : "bg-destructive"}`} title={user.user_status} />
                      </td>

                      <td className="px-4 py-2 text-sm text-center -">
                        <Button size="sm" variant='ghost' onClick={() => confirmToggleStatus(user)}>
                          <div className="flex items-center gap-1">
                            {user.user_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-destructive" size={14} />}
                          </div>
                        </Button>
                        <Button size="sm" variant='ghost' onClick={() => editItem(user)}>
                          <div className="flex items-center gap-1">
                            <Pencil className="text-accent" size={14} />
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
      </AnimationWrapper>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-2xl p-6 ">

          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Confirmação
            </DialogTitle>
          </DialogHeader>


          <p className="py-6 text-gray-700 dark:text-gray-300 text-center text-lg">
            Deseja realmente{" "}
            <span
              className={`font-semibold ${selectedItem?.user_status === "ativo"
                ? "text-red-600 "
                : "text-green-600 dark:text-green-400"
                }`}
            >
              {selectedItem?.user_status === "ativo" ? "inativar" : "ativar"}
            </span>{" "}
            o usuário <strong>{selectedItem?.user_name}</strong>?
          </p>

          <DialogFooter className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
              Cancelar
            </Button>

            <Button
              className={`flex items-center gap-2 px-6 py-3 text-white transition
          ${selectedItem?.user_status === "ativo"
                  ? "bg-red-600 hover:bg-red-700 dark:hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                }
        `}
              onClick={toggleStatus}
            >
              <Check className="h-5 w-5" />
              {selectedItem?.user_status === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
