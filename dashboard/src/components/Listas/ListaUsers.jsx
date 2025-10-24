"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ListaUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3333/api/users");
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setUsers(data.docs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmToggleStatus = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const toggleStatus = async () => {
    if (!selectedUser) return;
    try {
      const action = selectedUser.status === "ativo" ? "inativar" : "ativar";
      const res = await fetch(`http://localhost:3333/api/users/${selectedUser.id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);
      toast.success(`Usuário ${selectedUser.status === "ativo" ? "inativado" : "ativado"} com sucesso!`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div className="space-y-4">
      <Toaster position="top-right" richColors />

      <Card className="mx-auto max-w-6xl">
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Nome</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">CPF</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Função</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Responsável</th> 
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Residência</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-2 text-sm">{user.name}</td>
                    <td className="px-4 py-2 text-sm">{user.email}</td>
                    <td className="px-4 py-2 text-sm">{user.cpf}</td>
                    <td className="px-4 py-2 text-sm">{user.type}</td>
                    <td className="px-4 py-2 text-sm">{user.role}</td>
                    <td className="px-4 py-2 text-sm font-bold flex items-center justify-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mt-3 ${
                          user.status === "ativo" ? "bg-green-600" : "bg-red-600"
                        }`}
                        title={user.status}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm">{user.responsavel_id || "-"}</td>
                    <td className="px-4 py-2 text-sm">{user.redisdencia_id || "-"}</td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant={user.status === "ativo" ? "destructive" : "outline"}
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

      {/* Dialog ShadCN */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Deseja realmente {selectedUser?.status === "ativo" ? "inativar" : "ativar"} o usuário{" "}
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
