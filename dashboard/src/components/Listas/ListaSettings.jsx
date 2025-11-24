"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Toaster, toast } from "sonner";
import {
  Shield,
  User,
  Calendar,
  Settings,
  Check,
  X,
  Plus,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  UserCircle2,
  Crown,
  Edit,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToggleConfirm from "@/hooks/useStatus";
import { useAdmins } from "@/hooks/useAdmins";
import AnimationWrapper from "../Layout/Animation/Animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import SettingsGeral from "../Cards/SettingsGeral";

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("admins");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  const { addAdmin, fetchAdmins, editAdmin } = useAdmins();

  const API_URL =
    activeTab === "admins"
      ? "http://localhost:3333/api/admins"
      : activeTab === "users"
        ? "http://localhost:3333/api/users"
        : null;

  const fetchData = async () => {
    if (activeTab === "geral") return;

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

  const {
    showModal,
    setShowModal,
    selectedItem,
    confirmToggleStatus,
    toggleStatus,
  } = useToggleConfirm(API_URL, fetchData);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getRole = (item) =>
    (item.role || item.type || item.user_role || "").toLowerCase();

  const roleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-600";
      case "admin":
        return "bg-accent/60";
      case "sindico":
        return "bg-yellow-500";
      case "morador":
        return "bg-sky-500";
      default:
        return "bg-gray-500";
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

  const handleEditAdmin = (admin) => {
    setEditForm({
      id: admin.id,
      email: admin.email,
      role: admin.role || admin.type || "admin",
    });

    setOpenEditAdmin(true);
  };

  const saveEditAdmin = async () => {
    if (!editForm.email) {
      toast.error("Email obrigatório!");
      return;
    }

    const payload = {
      email: editForm.email,
      role: editForm.role,
    };

    await editAdmin(editForm.id, payload);
    await fetchData();
    setOpenEditAdmin(false);
  };

  if (loading && activeTab !== "geral") return <Loading />;
  if (error)
    return (
      <div className="p-10 text-center text-destructive font-semibold">
        Erro: {error}
      </div>
    );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
        <Toaster position="top-right" richColors />

        {/* Sidebar */}
        <aside className="w-full md:w-64 md:h-65 bg-sidebar border-b md:border-b-0 md:border-r border-border flex-shrink-0 flex flex-col rounded-none md:rounded-md ">
          <div className="flex items-center gap-2 p-6 text-lg font-semibold border-b border-border text-accent">
            <Settings className="text-accent" size={20} />
            Configurações
          </div>

          <nav className="flex-1 flex flex-row justify-center md:flex-col overflow-x-auto md:overflow-visible py-2 md:py-4 px-2 md:px-0 ">
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-md whitespace-nowrap ${activeTab === "admins"
                  ? "bg-muted border-b-2 md:border-b-0 md:border-r-4 border-accent text-accent"
                  : "text-sidebar-foreground hover:text-accent"
                }`}
            >
              <Shield size={18} />
              Administradores
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-md whitespace-nowrap ${activeTab === "users"
                  ? "bg-muted border-b-2 md:border-b-0 md:border-r-4 border-accent text-accent"
                  : "text-sidebar-foreground hover:text-accent"
                }`}
            >
              <User size={18} />
              Usuários
            </button>

            <button
              onClick={() => setActiveTab("geral")}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-md whitespace-nowrap ${activeTab === "geral"
                  ? "bg-muted border-b-2 md:border-b-0 md:border-r-4 border-accent text-accent"
                  : "text-sidebar-foreground hover:text-accent"
                }`}
            >
              <BookOpen size={18} />
              Geral
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-auto">
          <AnimationWrapper delay={0.2}>
            <Card className="mx-auto">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>
                  {activeTab === "admins" && "Administradores"}
                  {activeTab === "users" && "Usuários"}
                  {activeTab === "geral" && "Configurações Gerais"}
                </CardTitle>

                <div className="flex gap-4 items-center">
                  {activeTab !== "geral" && (
                    <span className="text-sm text-muted-foreground">
                      {data.length} registros
                    </span>
                  )}

                  {activeTab === "admins" && (
                    <Button
                      className="h-8 sm:h-7 w-full sm:w-auto rounded-md bg-accent/80"
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

                {activeTab === "geral" && (
                  <div className="py-6">
                    <SettingsGeral />
                  </div>
                )}

                {activeTab !== "geral" && (
                  <div className="w-full overflow-x-auto">
                    {data.length === 0 ? (
                      <p className="text-center text-muted-foreground py-10">
                        Nenhum registro encontrado.
                      </p>
                    ) : (
                      <table className="min-w-full divide-y-2 divide-border text-sm">
                        <thead className="bg-muted">
                          <tr>
                            {activeTab === "users" && (
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                                Nome
                              </th>
                            )}
                            {activeTab === "admins" && (
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                                Email
                              </th>
                            )}
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                              Função
                            </th>
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                              Status
                            </th>
                            {activeTab === "admins" && (
                              <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                                Criado em
                              </th>
                            )}
                            <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium uppercase">
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
                                  <td className="px-2 sm:px-4 py-2">
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
                                  <td className="px-2 sm:px-4 py-2 text-sm">
                                    {item.email || "-"}
                                  </td>
                                )}
                                <td className="text-sm">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white font-semibold uppercase ${role === "morador"
                                        ? "bg-sky-500"
                                        : role === "sindico"
                                          ? "bg-yellow-400 text-black"
                                          : role === "admin"
                                            ? "bg-blue-600"
                                            : role === "superadmin"
                                              ? "bg-purple-600"
                                              : "bg-gray-500"
                                      }`}
                                  >
                                    {role === "morador" ? (
                                      <>
                                        <User className="w-4 h-4" />
                                        Morador
                                      </>
                                    ) : role === "sindico" ? (
                                      <>
                                        <Crown className="w-4 h-4" />
                                        Síndico
                                      </>
                                    ) : role === "admin" ? (
                                      <>
                                        <Shield className="w-4 h-4" />
                                        Admin
                                      </>
                                    ) : role === "superadmin" ? (
                                      <>
                                        <ShieldCheck className="w-4 h-4" />
                                        SuperAdmin
                                      </>
                                    ) : (
                                      <>
                                        <UserCircle2 className="w-4 h-4" />
                                        Desconhecido
                                      </>
                                    )}
                                  </span>
                                </td>

                                <td className="px-2 sm:px-4 py-2">
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full mt-3 ${status === "ativo"
                                        ? "bg-green-600"
                                        : "bg-destructive"
                                      }`}
                                  />
                                </td>

                                {activeTab === "admins" && (
                                  <td className="px-2 sm:px-4 py-2 flex items-center gap-2 text-sm">
                                    <Calendar size={14} />
                                    {new Date(
                                      item.criado_em ||
                                      item.created_at ||
                                      Date.now()
                                    ).toLocaleDateString("pt-BR")}
                                  </td>
                                )}

                                <td className="px-2 sm:px-4 py-2 text-center">
                                  {activeTab === "admins" && (
                                    <div className="">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              confirmToggleStatus(item)
                                            }
                                            disabled={role === "superadmin"}
                                            className={
                                              role === "superadmin"
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }
                                          >
                                            {status === "ativo" ? (
                                              <Check
                                                className="text-green-500"
                                                size={14}
                                              />
                                            ) : (
                                              <X
                                                className="text-destructive"
                                                size={14}
                                              />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {status === "ativo"
                                            ? "Inativar admin"
                                            : "Ativar admin"}
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled={
                                              role === "superadmin"
                                            }
                                            onClick={() =>
                                              handleEditAdmin(item)
                                            }
                                          >
                                            <Edit
                                              className="text-accent"
                                              size={14}
                                            />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Editar
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimationWrapper>
        </main>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div
              className={`h-2 w-full rounded-t-md ${(selectedItem?.status || selectedItem?.user_status) === "ativo"
                  ? "bg-red-600"
                  : "bg-green-600"
                }`}
            />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div
                className={`p-4 rounded-full ${(selectedItem?.status || selectedItem?.user_status) === "ativo"
                    ? "bg-red-100 dark:bg-red-900"
                    : "bg-green-100 dark:bg-green-900"
                  }`}
              >
                <AlertTriangle
                  className={`h-10 w-10 ${(selectedItem?.status || selectedItem?.user_status) ===
                      "ativo"
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
                  className={`font-semibold ${(selectedItem?.status ||
                      selectedItem?.user_status) === "ativo"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                    }`}
                >
                  {(selectedItem?.status ||
                    selectedItem?.user_status) === "ativo"
                    ? "inativar"
                    : "ativar"}
                </span>{" "}
                o usuário{" "}
                <strong>
                  {selectedItem?.user_name || selectedItem?.email}
                </strong>
                ?
              </p>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setShowModal(false)}
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                className={`flex items-center gap-2 px-6 py-3 text-white transition ${(selectedItem?.status ||
                    selectedItem?.user_status) === "ativo"
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

        <Dialog
          open={showNewAdminModal}
          onOpenChange={setShowNewAdminModal}
        >
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div className="h-2 w-full bg-primary rounded-t-md" />

            <DialogHeader className="flex items-center space-x-2 pb-3 mt-3">
              <UserPlus className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-bold">
                Criar Novo Administrador
              </DialogTitle>
            </DialogHeader>

            <div className="px-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      handleNewAdminChange("email", e.target.value)
                    }
                    placeholder="email@exemplo.com"
                    className="border border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Senha</label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      handleNewAdminChange("password", e.target.value)
                    }
                    placeholder="••••••••"
                    className="border border-border"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewAdminModal(false)}
                  className="w-32"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleCreateAdmin}
                  className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Criar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal editar admin */}
        <Dialog open={openEditAdmin} onOpenChange={setOpenEditAdmin}>
          <DialogContent className="sm:max-w-[600px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div className="h-2 w-full bg-primary rounded-t-md" />

            <DialogHeader className="flex items-center space-x-2 pb-3 mt-3">
              <Edit className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-bold">
                Editar Administrador
              </DialogTitle>
            </DialogHeader>

            <div className="px-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1">Email</label>
                  <Input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                    className="border border-border"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 flex justify-end gap-3">
                <Button
                 variant="ghost"
                  onClick={() => setOpenEditAdmin(false)}
                  className="w-32"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={saveEditAdmin}
                  className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
