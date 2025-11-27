"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import AnimationWrapper from "../Layout/Animation/Animation";
import Loading from "../Layout/Loading/page";

// Paleta de cores
const palette = [
  "#3b82f6", "#10b981", "#facc15", "#8b5cf6", "#ec4899",
  "#ef4444", "#14b8a6", "#6366f1", "#f97316", "#06b6d4",
  "#f43f5e", "#7c3aed", "#22c55e", "#0ea5e9", "#fbbf24",
  "#e11d48", "#0f766e", "#1e3a8a", "#ea580c", "#8b0000",
  "#ffd700", "#32cd32", "#ff69b4", "#4b0082",
];


function getUniqueColors(count) {
  const shuffled = [...palette];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count); 
}

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

        const arrayConvertido = Object.entries(data).map(([estado, valores]) => ({
          estado,
          casas: valores.casas,
          condominios: valores.condominios,
          total: valores.casas + valores.condominios,
        }));

        const totalGeral = arrayConvertido.reduce((acc, curr) => acc + curr.total, 0);

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

  if (loading) return <Loading />;

  const colors = getUniqueColors(dados.length);

  return (
    <AnimationWrapper delay={0.2}>
      <section className="container mx-auto mt-10">
        <Card className="w-full hover:border-sky-400 dark:hover:border-sky-950 ">
          <CardHeader>
            <CardTitle>Distribuição por Estado</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-0">

            <ScrollArea className="h-148  px-6 py-4">
              {dados.map((item, i) => (
                <div key={i} className="mb-4">
                  
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {item.estado}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.total} residências
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.porcentagem}%`,
                        backgroundColor: colors[i], 
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{item.porcentagem.toFixed(0)}%</span>
                  </div>

                </div>
              ))}
            </ScrollArea>

          </CardContent>
        </Card>
      </section>
    </AnimationWrapper>
  );
}
