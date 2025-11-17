"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Home, Building, Check, X, AlertTriangle } from "lucide-react";

export default function AlertasRecentes() {
  const [alertas] = useState([
    {
      id: "1",
      usuario: "Fulano de Tal",
      residencia_type: "casa",
      residencia_logradouro: "Rua A",
      residencia_numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      tipo: "vazamento",
      nivel: "alto",
      status: "ativo",
      data: "2025-11-16 14:32",
    },
    {
      id: "2",
      usuario: "Beltrano Silva",
      residencia_type: "apartamento",
      residencia_logradouro: "Bloco B",
      residencia_numero: "203",
      bairro: "Jardim das Flores",
      cidade: "São Paulo",
      uf: "SP",
      tipo: "consumo_alto",
      status: "ativo",
      data: "2025-11-16 13:10",
    },
  ]);

  return (
    <Card className="mx-auto mt-10 hover:border-sky-400 dark:hover:border-sky-950">
      <CardHeader>
        <CardTitle>Últimos Alertas</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {alertas.length === 0 ? (
          <p>Nenhum alerta encontrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Usuário</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Residência</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase">Data</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {alertas.slice(0, 5).map((alerta) => (
                <tr key={alerta.id} className="hover:bg-muted/10 text-foreground">
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-sky-600 mt-1" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{alerta.usuario}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-sky-600 mt-1" />
                      <div>
                        {alerta.residencia_type === "casa" ? (
                          <>{alerta.residencia_logradouro}, {alerta.residencia_numero}</>
                        ) : (
                          <>Bloco {alerta.residencia_logradouro}, {alerta.residencia_numero}</>
                        )}
                        <div className="text-xs text-foreground/80">
                          {alerta.bairro}, {alerta.cidade} / {alerta.uf}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/80 text-white font-semibold uppercase">
                      <AlertTriangle className="w-4 h-4" /> {alerta.tipo.replace("_", " ")}
                    </span>
                  </td>

            
                  <td className="text-sm px-4 py-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        alerta.status === "ativo" ? "bg-green-600" : "bg-destructive"
                      }`}
                    />
                  </td>

                  <td className="text-sm px-4 py-2">
                    {alerta.data}
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
