"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import AnimationWrapper from "../Layout/Animation/Animation";
import Loading from "../Layout/Loading/page";

// Paleta de cores
const palette = [
  "#3b82f6", // azul
  "#10b981", // verde
  "#facc15", // amarelo
  "#8b5cf6", // roxo
  "#ec4899", // rosa
  "#ef4444", // vermelho
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#f97316", // laranja
  "#06b6d4", // cyan
  "#f43f5e", // rosa escuro
  "#7c3aed", // roxo escuro
  "#22c55e", // verde claro
  "#0ea5e9", // azul claro
  "#fbbf24", // amarelo queimado
  "#e11d48", // vermelho escuro
  "#0f766e", // teal escuro
  "#1e3a8a", // azul marinho
  "#ea580c", // laranja queimado
  "#8b0000", // bordô
  "#ffd700", // dourado
  "#32cd32", // verde limão
  "#ff69b4", // rosa vibrante
  "#4b0082", // índigo escuro
];


// Função para sortear cores sem repetir até acabar a paleta
function getUniqueColors(count) {
  const colors = [];
  const used = new Set();
  for (let i = 0; i < count; i++) {
    const available = palette.filter((c) => !used.has(c));
    if (available.length === 0) used.clear(); // reinicia se acabar
    const color = available[Math.floor(Math.random() * available.length)];
    colors.push(color);
    used.add(color);
  }
  return colors;
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
        <Card className="w-full  hover:border-sky-400 dark:hover:border-sky-700">
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

           
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.porcentagem}%`, backgroundColor: colors[i] }}
                  ></div>
                </div>

                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{item.porcentagem.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AnimationWrapper>
  );
}
