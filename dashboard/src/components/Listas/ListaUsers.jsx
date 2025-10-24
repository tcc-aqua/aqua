"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function ListaUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar usuários
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

  // Ativar ou inativar usuário
  const toggleStatus = async (userId, isAtivo) => {
    try {
      const action = isAtivo ? "inativar" : "ativar";
      const res = await fetch(`http://localhost:3333/api/users/${userId}/${action}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);

      toast.success(`Usuário ${isAtivo ? "inativado" : "ativado"} com sucesso!`);
      fetchUsers(); 
    } catch (err) {
      toast.error(err.message);
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
                    <td className={`px-4 py-2 text-sm font-bold ${user.status === "ativo" ? "text-green-600" : "text-red-600"}`}>
                      {user.status}
                    </td>
                    <td className="px-4 py-2 text-sm">{user.responsavel_id || "-"}</td>
                     <td className="px-4 py-2 text-sm">{user.redisdencia_id || "-"}</td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant={user.status === "ativo" ? "destructive" : "outline"}
                        onClick={() => toggleStatus(user.id, user.status === "ativo")}
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
    </div>
  );
}
