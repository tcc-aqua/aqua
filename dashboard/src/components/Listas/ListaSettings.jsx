"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Toaster, toast } from "sonner";
import {
  Shield,
  User,
  Calendar,

  Check,
  X,
  Plus,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  UserCircle2,
  Crown,
  Edit,
 
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
import { PaginationDemo } from "../pagination/pagination";
import { Separator } from "../ui/separator";

export default function SettingsDashboard() {
  // --- estado básico
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({});

  // modais
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [openEditAdmin, setOpenEditAdmin] = useState(false);

  // new admin form
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // rota fixa (só admins)
  const API_URL = "http://localhost:3333/api/admins";

  const { addAdmin, fetchAdmins, editAdmin } = useAdmins();

  // fetchData compatível com { docs, pages, total }
  const fetchData = async (pageArg = page, limitArg = limit) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(pageArg),
        limit: String(limitArg),
      });

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(
          text || `Erro ao buscar dados (status ${res.status})`
        );
      }

      const json = await res.json();

      // extrair docs e páginas conforme seu JSON
      const items = Array.isArray(json.docs) ? json.docs : json.docs || [];
  setData(
  items.sort((a, b) => {
    const roleOrder = {
      superadmin: 2,
      admin: 1,
      morador: 0,
      sindico: 0,
      user: 0,
    };

    const roleA = roleOrder[(a.type || a.role || "").toLowerCase()] ?? 0;
    const roleB = roleOrder[(b.type || b.role || "").toLowerCase()] ?? 0;

    
    if (roleA !== roleB) return roleB - roleA;


    const statusA = (a.status || a.user_status) === "ativo" ? 1 : 0;
    const statusB = (b.status || b.user_status) === "ativo" ? 1 : 0;

    if (statusA !== statusB) return statusB - statusA;


    return new Date(b.criado_em) - new Date(a.criado_em);
  })
);



      const pagesFromApi =
        typeof json.pages === "number"
          ? json.pages
          : json.total
          ? Math.max(1, Math.ceil(json.total / limitArg))
          : 1;
      setTotalPages(pagesFromApi);


      setTotalItems(json.total || items.length || 0);
    } catch (err) {
      setError(err.message || "Erro desconhecido");
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
    fetchData(page, limit);
   
  }, [page, limit]);

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

      await fetchData(page, limit);

      if (typeof fetchAdmins === "function") fetchAdmins();
      toast.success("Administrador criado!");
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

    try {
      await editAdmin(editForm.id, payload);
      await fetchData(page, limit);
      setOpenEditAdmin(false);
      toast.success("Administrador atualizado!");
    } catch (err) {
      toast.error("Erro ao salvar edição!");
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
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
        <Toaster position="top-right" richColors />

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-auto">
          <h1 className="font-bold  text-accent text-3xl">
            Criar novos Administradores
          </h1>
          <h2 className="font-semibold text-foreground/60 mt-3  ml-3">
            Crie e edite seus administradores
          </h2>
          <AnimationWrapper delay={0.2}>
            <div className="flex gap-4 items-center justify-end mb-5">
              <span className=" inline-flex items-center gap-1 px-2 py-1 rounded-md border font-semibold text-accent/70">
                {totalItems} registros
              </span>

              <Button
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                variant="default"
                onClick={() => setShowNewAdminModal(true)}
              >
                <Plus size={14} />
                Novo Admin
              </Button>
            </div>
            <Card className="mx-auto">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Administradores</CardTitle>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <div className="w-full overflow-x-auto">
                  {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                      Nenhum registro encontrado.
                    </p>
                  ) : (
                    <table className="min-w-full divide-y-2 divide-border text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                            Email
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                            Função
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                            Status
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase">
                            Criado em
                          </th>
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
                              <td className="px-2 sm:px-4 py-2 text-sm">
                                {item.email || "-"}
                              </td>

                              <td className="text-sm">
                                <span
                                  className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-md border  font-semibold
      ${role === "morador"
                                    ? "text-sky-500 "
                                    : role === "sindico"
                                    ? "text-yellow-500 "
                                    : role === "admin"
                                    ? "text-blue-600 "
                                    : role === "superadmin"
                                    ? "text-purple-600 "
                                    : "text-gray-500 "}
    `}
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

                              <td className="text-sm font-semibold px-3 py-4">
                                <span
                                  className={`
                             inline-flex items-center gap-2 px-2 py-1 rounded-md border 
                           ${status === "ativo"
                                      ? "text-green-500 border-green-600"
                                      : "text-destructive border-red-600"}`}
                                >
                                  {status === "ativo" ? "Ativo" : "Inativo"}
                                </span>
                              </td>

                              <td className="px-2 sm:px-4 py-2 flex items-center gap-2 text-sm">
                                <Calendar size={14} />
                                {new Date(
                                  item.criado_em || item.created_at || Date.now()
                                ).toLocaleDateString("pt-BR")}
                              </td>

                              <td className="px-2 sm:px-4 py-2 text-center">
                                <div className="">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
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
                                      {status === "ativo" ? "Inativar admin" : "Ativar admin"}
                                    </TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={role === "superadmin"}
                                        onClick={() => handleEditAdmin(item)}
                                      >
                                        <Edit className="text-accent" size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>

              <Separator />
              <PaginationDemo
                currentPage={page}
                totalPages={totalPages}
                onChangePage={(newPage) => setPage(newPage)}
                maxVisible={5}
              />
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

        {/* Novo Admin */}
        <Dialog open={showNewAdminModal} onOpenChange={setShowNewAdminModal}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div className="h-2 w-full bg-primary rounded-t-md" />

            <DialogHeader className="flex items-center space-x-2 pb-3 mt-3">
              <UserPlus className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-bold">Criar Novo Administrador</DialogTitle>
            </DialogHeader>

            <div className="px-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => handleNewAdminChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                    className="border border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Senha</label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => handleNewAdminChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="border border-border"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowNewAdminModal(false)} className="w-32">
                  Cancelar
                </Button>

                <Button onClick={handleCreateAdmin} className="w-32 bg-primary text-primary-foreground hover:bg-primary/90">
                  Criar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Admin */}
        <Dialog open={openEditAdmin} onOpenChange={setOpenEditAdmin}>
          <DialogContent className="sm:max-w-[600px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div className="h-2 w-full bg-primary rounded-t-md" />

            <DialogHeader className="flex items-center space-x-2 pb-3 mt-3">
              <Edit className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-bold">Editar Administrador</DialogTitle>
            </DialogHeader>

            <div className="px-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1">Email</label>
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="border border-border"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setOpenEditAdmin(false)} className="w-32">
                  Cancelar
                </Button>

                <Button onClick={saveEditAdmin} className="w-32 bg-primary text-primary-foreground hover:bg-primary/90">
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
