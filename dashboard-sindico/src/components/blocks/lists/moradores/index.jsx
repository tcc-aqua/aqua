"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Home, Building, Crown, UserCircle2, Check, X } from "lucide-react";

export default function UsersTableOnly() {
  const [users] = useState([
    {
      user_id: "1",
      user_name: "Fulano de Tal",
      user_email: "fulano@email.com",
      user_cpf: "123.456.789-00",
      user_status: "ativo",
      user_type: "casa",
      user_role: "morador",
      logradouro: "Rua A",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      cep: "00000-000",
    },
  ]);

  return (
    <Card className="mx-auto mt-10 hover:border-sky-400 dark:hover:border-sky-950">
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
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Residência</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Função</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-2 text-center text-xs font-medium uppercase">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-muted/10 text-foreground">
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-sky-600 mt-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.user_name}</span>
                        <span className="text-xs text-foreground/80">{user.user_email}</span>
                        <span className="text-xs text-foreground/60">{user.user_cpf}</span>
                        <span className={`text-[10px] font-bold ${user.user_status === "ativo" ? "text-green-600" : "text-destructive"}`}>
                          {user.user_status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-sky-600 mt-4" />
                      <div>
                        {user.user_type === "casa" ? (
                          <>{user.logradouro}, {user.numero}</>
                        ) : (
                          <>Bloco {user.logradouro}, {user.numero}</>
                        )}

                        <div className="text-xs text-foreground/80">
                          {user.bairro}, {user.cidade} / {user.uf}
                        </div>

                        <div className="text-[10px] text-foreground/60">CEP: {user.cep}</div>
                      </div>
                    </div>
                  </td>

                  <td className="text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white font-semibold uppercase ${user.user_type === "casa" ? "bg-sky-700" : "bg-purple-400"}`}
                    >
                      {user.user_type === "casa" ? (
                        <>
                          <Home className="w-4 h-4" /> Casa
                        </>
                      ) : (
                        <>
                          <Building className="w-4 h-4" /> Condomínio
                        </>
                      )}
                    </span>
                  </td>

                  <td className="text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-white font-semibold uppercase ${user.user_role === "morador" ? "bg-sky-500" : "bg-yellow-400 text-black"}`}
                    >
                      {user.user_role === "morador" ? (
                        <>
                          <User className="w-4 h-4" /> Morador
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4" /> Síndico
                        </>
                      )}
                    </span>
                  </td>

                  <td className="text-sm font-bold px-9 py-4">
                    <span className={`inline-block w-3 h-3 rounded-full ${user.user_status === "ativo" ? "bg-green-600" : "bg-destructive"}`} />
                  </td>

                  <td className="px-4 py-2 text-sm text-center">
                    <Button size="sm" variant="ghost">
                      {user.user_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-destructive" size={14} />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}