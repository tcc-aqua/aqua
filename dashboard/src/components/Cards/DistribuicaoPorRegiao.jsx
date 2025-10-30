"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Building, Home } from "lucide-react";
import Loading from "../Layout/Loading/page";

export default function DistribuicaoPorRegiao() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3333/api/residencias/estados";

  useEffect(() => {
    async function fetchDistribuicao() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const data = await res.json();

        // Converte o objeto em um array
        const arrayConvertido = Object.entries(data).map(([estado, valores]) => ({
          estado,
          casas: valores.casas,
          condominios: valores.condominios,
          total: valores.casas + valores.condominios,
        }));

        // Calcula o total geral
        const totalGeral = arrayConvertido.reduce((acc, curr) => acc + curr.total, 0);

        // Adiciona porcentagem para cada estado
        const comPorcentagem = arrayConvertido.map((item) => ({
          ...item,
          porcentagem: totalGeral > 0 ? (item.total / totalGeral) * 100 : 0,
        }));

        setDados(comPorcentagem);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar dados de distribuição");
      } finally {
        setLoading(false);
      }
    }

    fetchDistribuicao();
  }, []);

  if (loading) return <p className="text-muted-foreground"></p>;

  return (
    
    <section className="container mx-auto mt-10 ">
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribuição por Estado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dados.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm text-foreground">{item.estado}</span>
              <span className="text-sm text-muted-foreground">
                {item.total} residências
              </span>
            </div>
            <Progress
              value={item.porcentagem}
              className={`h-2 rounded-full ${
                item.estado === "São Paulo"
                  ? "bg-blue-100 [&>div]:bg-blue-600"
                  : item.estado === "Rio de Janeiro"
                  ? "bg-green-100 [&>div]:bg-green-600"
                  : item.estado === "Minas Gerais"
                  ? "bg-yellow-100 [&>div]:bg-yellow-500"
                  : item.estado === "Paraná"
                  ? "bg-purple-100 [&>div]:bg-purple-500"
                  : "bg-gray-100 [&>div]:bg-gray-500"
              }`}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{item.porcentagem.toFixed(1)}%</span>
             
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  

    </section>
    
  );
}
