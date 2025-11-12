"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Toaster, toast } from "sonner";
import { Shield, User, Calendar, Settings, Check, X, Plus, XCircle, CheckCircle, AlertTriangle, UserPlus } from "lucide-react";
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
import { useAdmins } from "@/hooks/useAdmins";
import AnimationWrapper from "../Layout/Animation/Animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("admins");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", role: "superadmin" });

  const { addAdmin, fetchAdmins } = useAdmins();

  const API_URL = activeTab === "admins"
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
          return statusA === statusB ? 0 : statusA === "ativo" ? -1 : 1;
        })
        : [];
      setData(sortedItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus } =
    useToggleConfirm(API_URL, fetchData);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getRole = (item) => (item.role || item.type || item.user_role || "").toLowerCase();

  const roleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-600 ";
      case "admin":
        return "bg-accent/60 ";
      case "sindico":
        return "bg-yellow-500 ";
      case "morador":
        return "bg-sky-500";
      default:
        return "bg-gray-500 ";
    }
  };

  const handleNewAdminChange = (field, value) => {
    setNewAdmin({ ...newAdmin, [field]: value });
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      await addAdmin(newAdmin);
      setShowNewAdminModal(false);
      setNewAdmin({ email: "", password: "", role: "admin" });
      fetchAdmins();
      fetchData();
    } catch (err) {
      toast.error("Erro ao criar administrador!");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="p-10 text-center text-destructive font-semibold">
        Erro: {error}
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen bg-background text-foreground">
        <Toaster position="top-right" richColors />

        <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-full rounded-md">
          <div className="flex items-center gap-2 p-6 text-lg font-semibold border-b border-border text-accent">
            <Settings className="text-accent" size={20} />
            Configurações
          </div>

          <nav className="flex-1 flex flex-col py-4">
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 rounded-md ${activeTab === "admins"
                ? "bg-muted border-r-4 border-accent text-accent"
                : "text-sidebar-foreground hover:text-accent"
                }`}
            >
              <Shield size={18} />
              Administradores
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 rounded-md ${activeTab === "users"
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
                <CardTitle>
                  {activeTab === "admins" ? "Administradores" : "Usuários"}
                </CardTitle>
                <div className="flex gap-4 items-center">
                  <span className="text-sm text-muted-foreground">
                    {data.length} registros
                  </span>
                  {activeTab === "admins" && (
                    <Button
                      className="h-7 w-full sm:w-auto rounded-md bg-accent/80"
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
                  <p className="text-center text-muted-foreground py-10">
                    Nenhum registro encontrado.
                  </p>
                ) : (
                  <table className="min-w-full divide-y-2 divide-border">
                    <thead className="bg-muted">
                      <tr>
                        {activeTab === "users" && (
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                            Nome
                          </th>
                        )}
                        {activeTab === "admins" && (
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                            Email
                          </th>
                        )}
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Função
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Status
                        </th>
                        {activeTab === "admins" && (
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                            Criado em
                          </th>
                        )}
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                          Ações
                        </th>
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
                                  <span className="font-semibold text-sm">
                                    {item.user_name || "-"}
                                  </span>
                                  <span className="text-xs text-foreground/80">
                                    {item.user_email || "-"}
                                  </span>
                                </div>
                              </td>
                            ) : (
                              <td className="px-4 py-2 text-sm">
                                {item.email || "-"}
                              </td>
                            )}

                            <td className="px-4 py-2 text-xs">
                              <span
                                className={`px-2 py-1 rounded-full text-white font-semibold ${roleColor(
                                  role
                                )}`}
                              >
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
                                className={`inline-block w-3 h-3 rounded-full mt-3  ${status === "ativo"
                                  ? "bg-green-600"
                                  : "bg-destructive"
                                  }`}
                              />
                            </td>

                            {activeTab === "admins" && (
                              <td className="px-4 py-2 flex items-center gap-2 text-sm">
                                <Calendar size={14} />
                                {new Date(
                                  item.criado_em || item.created_at || Date.now()
                                ).toLocaleDateString("pt-BR")}
                              </td>
                            )}

                            <td className="px-4 py-2 text-center">
                              {activeTab === "admins" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => confirmToggleStatus(item)}
                                  disabled={role === "superadmin"}
                                  className={
                                    role === "superadmin"
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }
                                >
                                  {status === "ativo" ? (
                                    <Check className="text-green-500  hover:bg-green-100" size={14} />
                                  ) : (
                                    <X className="text-destructive" size={14} />
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

      {/* Modal de Confirmação Usuário */}
<Dialog open={showModal} onOpenChange={setShowModal}>
  <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
    
    {/* Barra superior colorida */}
    <div
      className={`h-2 w-full rounded-t-md ${
        (selectedItem?.status || selectedItem?.user_status) === "ativo"
          ? "bg-red-600"
          : "bg-green-600"
      }`}
    />

    <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
      <div
        className={`p-4 rounded-full ${
          (selectedItem?.status || selectedItem?.user_status) === "ativo"
            ? "bg-red-100 dark:bg-red-900"
            : "bg-green-100 dark:bg-green-900"
        }`}
      >
        <AlertTriangle
          className={`h-10 w-10 ${
            (selectedItem?.status || selectedItem?.user_status) === "ativo"
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        />
      </div>
      <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
        Confirmação
      </DialogTitle>
    </DialogHeader>

    <div className="mt-5 px-4 text-foreground/90 text-center text-lg">
      <p>
        Deseja realmente{" "}
        <span
          className={`font-semibold ${
            (selectedItem?.status || selectedItem?.user_status) === "ativo"
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {(selectedItem?.status || selectedItem?.user_status) === "ativo"
            ? "inativar"
            : "ativar"}
        </span>{" "}
        o usuário <strong>{selectedItem?.user_name || selectedItem?.email}</strong>?
      </p>
    </div>

    <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setShowModal(false)}
      >
        <X className="h-5 w-5" />
        Cancelar
      </Button>

      <Button
        className={`flex items-center gap-2 px-6 py-3 text-white transition ${
          (selectedItem?.status || selectedItem?.user_status) === "ativo"
            ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        }`}
        onClick={toggleStatus}
      >
        <Check className="h-5 w-5" />
        {(selectedItem?.status || selectedItem?.user_status) === "ativo"
          ? "Inativar"
          : "Ativar"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Modal Criar Novo Admin */}
<Dialog open={showNewAdminModal} onOpenChange={setShowNewAdminModal}>
  <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
    
    <DialogHeader className="flex items-center space-x-2 border-b border-border pb-4 px-4">
      <UserPlus className="h-5 w-5 text-primary" />
      <DialogTitle className="text-lg font-semibold text-foreground">
        Criar Novo Admin
      </DialogTitle>
    </DialogHeader>

    <div className="flex flex-col gap-4 py-4 px-4">
      <Input
        type="email"
        placeholder="Email"
        value={newAdmin.email}
        onChange={(e) => handleNewAdminChange("email", e.target.value)}
        className="text-foreground border border-border focus:border-primary focus:ring focus:ring-primary/20 rounded-md"
      />
      <Input
        type="password"
        placeholder="Senha"
        value={newAdmin.password}
        onChange={(e) => handleNewAdminChange("password", e.target.value)}
        className="text-foreground border border-border focus:border-primary focus:ring focus:ring-primary/20 rounded-md"
      />
      <Select
        value={newAdmin.role}
        onValueChange={(value) => handleNewAdminChange("role", value)}
      >
        <SelectTrigger className="text-foreground border border-border focus:border-primary focus:ring focus:ring-primary/20 rounded-md">
          <SelectValue placeholder="Selecione a função" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="superadmin">SuperAdmin</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <DialogFooter className="flex justify-end mt-4 border-t border-border pt-4 space-x-2 px-4">
      <Button
        variant="outline"
        className="flex items-center gap-2 border-border text-foreground hover:bg-muted"
        onClick={() => setShowNewAdminModal(false)}
      >
        Cancelar
      </Button>
      <Button
        variant="default"
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={handleCreateAdmin}
      >
        <UserPlus className="h-4 w-4" />
        Criar
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </div>
    </>
  );
}
