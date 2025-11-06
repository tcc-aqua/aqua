"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Toaster } from "sonner";
import { Shield, User, Calendar, Settings } from "lucide-react";
import { Check, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useToggleConfirm from "@/hooks/useStatus";
import AnimationWrapper from "../Layout/Animation/Animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("admins");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", role: "admin" });

  const API_URL =
    activeTab === "admins"
      ? "http://localhost:3333/api/admins"
      : "http://localhost:3333/api/users";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar dados");
      const json = await res.json();
      const items = json.docs || json || [];
      const sortedItems = Array.isArray(items)
        ? items.sort((a, b) => {
            const statusA = a.status || a.user_status;
            const statusB = b.status || b.user_status;
            if (statusA === statusB) return 0;
            return statusA === "ativo" ? -1 : 1;
          })
        : [];
      setData(sortedItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { selectedItem, confirmToggleStatus, toggleStatus } =
    useToggleConfirm(API_URL, fetchData);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getRole = (item) => (item.role || item.type || item.user_role || "").toLowerCase();

  const roleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-700 text-white";
      case "admin":
        return "bg-blue-700 text-white";
      case "sindico":
        return "bg-yellow-500 text-white";
      case "morador":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleNewAdminChange = (field, value) => {
    setNewAdmin({ ...newAdmin, [field]: value });
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;

    try {
      const res = await fetch("http://localhost:3333/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      if (!res.ok) throw new Error("Erro ao criar admin");
      setShowNewAdminModal(false);
      setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Erro: {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />

      <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-full rounded-md">
        <div className="flex items-center gap-2 p-6 text-lg font-semibold border-b border-border text-accent">
          <Settings className="text-accent" size={20} />
          Configurações
        </div>

        <nav className="flex-1 flex flex-col py-4 ">
          <button
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 rounded-md ${
              activeTab === "admins"
                ? "bg-muted border-r-4 border-accent text-accent"
                : "text-sidebar-foreground hover:text-accent"
            }`}
          >
            <Shield size={18} />
            Administradores
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 rounded-md ${
              activeTab === "users"
                ? "bg-muted border-r-4 border-accent text-accent"
                : "text-sidebar-foreground hover:text-accent"
            }`}
          >
            <User size={18} />
            Usuários
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-x-auto">
        <AnimationWrapper delay={0.2}>
          <Card className="mx-auto">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{activeTab === "admins" ? "Administradores" : "Usuários"}</CardTitle>
              <div className="flex gap-4 items-center">
                <span className="text-sm text-muted-foreground">{data.length} registros</span>
                {activeTab === "admins" && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setShowNewAdminModal(true)}
                  >
                    <Plus size={14} />
                    Novo Admin
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              {data.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Nenhum registro encontrado.</p>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      {activeTab === "users" && (
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">Nome</th>
                      )}
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Função</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Criado em</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {data.map((item) => {
                      const role = getRole(item);
                      const status = item.status || item.user_status;
                      return (
                        <tr
                          key={item.id || item.user_id}
                          className="hover:bg-muted/10 transition text-foreground"
                        >
                          {activeTab === "users" ? (
                            <td className="px-4 py-2">
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{item.user_name || "-"}</span>
                                <span className="text-xs text-foreground/80">{item.user_email || "-"}</span>
                              </div>
                            </td>
                          ) : (
                            <td className="px-4 py-2 text-sm font-stretch-50%">{item.email || "-"}</td>
                          )}

                          <td className="px-4 py-2 text-xs">
                            <span className={`px-2 py-1 rounded-full text-white font-extralight ${roleColor(role)}`}>
                              {role === "superadmin"
                                ? "Super Admin"
                                : role === "admin"
                                ? "Admin"
                                : role === "sindico"
                                ? "Síndico"
                                : role === "morador"
                                ? "Morador"
                                : "-"}
                            </span>
                          </td>

                          <td className="px-4 py-2">
                            <span
                              className={`inline-block w-3 h-3 rounded-full mt-3 px-3 ${
                                status === "ativo" ? "bg-green-600" : "bg-destructive"
                              }`}
                            />
                          </td>

                          <td className="px-4 py-2 flex items-center gap-2 text-sm">
                            <Calendar size={14} />
                            {new Date(item.criado_em || item.created_at || Date.now()).toLocaleDateString("pt-BR")}
                          </td>

                          <td className="px-4 py-2 text-center">
                            {activeTab === "admins" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => confirmToggleStatus(item)}
                                disabled={role === "superadmin"}
                                className={role === "superadmin" ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {status === "ativo" ? (
                                  <Check className="text-green-500" size={14} />
                                ) : (
                                  <X className="text-red-500" size={14} />
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </AnimationWrapper>
      </main>


      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[400px] bg-card text-foreground shadow-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirmar ação</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-center">
            Tem certeza que deseja{" "}
            <strong>{(selectedItem?.status || selectedItem?.user_status) === "ativo" ? "inativar" : "ativar"}</strong>{" "}
            este registro?
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              variant={(selectedItem?.status || selectedItem?.user_status) === "ativo" ? "destructive" : "default"}
              onClick={toggleStatus}
            >
              {(selectedItem?.status || selectedItem?.user_status) === "ativo" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewAdminModal} onOpenChange={setShowNewAdminModal}>
        <DialogContent className="sm:max-w-[400px] bg-card text-foreground shadow-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Criar Novo Admin</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Nome"
              value={newAdmin.name}
              onChange={(e) => handleNewAdminChange("name", e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => handleNewAdminChange("email", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={newAdmin.password}
              onChange={(e) => handleNewAdminChange("password", e.target.value)}
            />
            <Select value={newAdmin.role} onValueChange={(value) => handleNewAdminChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewAdminModal(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleCreateAdmin}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
