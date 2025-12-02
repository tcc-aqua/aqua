'use client';
import { useEffect, useState } from "react";
import { Home, Cpu, Users, Droplet, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { api } from "@/lib/api";

export default function CardsRelatorio() {
  const [stats, setStats] = useState({
    consumoAlto: 0,
    consumoMedio: 0,
    apartamentos: 0,
    vazamentos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatorios() {
      setLoading(true);
      setError(null);

      try {
        const [resConsumoAlto, resConsumoMedio, resApartamentos, resVazamentos] = await Promise.all([
          api.get('/relatorios/consumo-alto'),
          api.get('/relatorios/consumo-medio'),
          api.get('/relatorios/apartamentos'),
          api.get('/relatorios/vazamentos')
        ]);

        // Aqui usamos o retorno diretamente
        setStats({
          consumoAlto: resConsumoAlto.quantidade ?? 0,
          consumoMedio: resConsumoMedio.consumo_medio ?? 0,
          apartamentos: resApartamentos.numero_apartamentos ?? 0,
          vazamentos: resVazamentos.quantidade ?? 0,
        });

      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError("Falha na comunicação com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchRelatorios();
  }, []);

  const cardsData = [
    { title: "Consumo Alto", value: stats.consumoAlto, icon: Home, iconColor: "text-blue-500" },
    { title: "Média Mensal", value: stats.consumoMedio, icon: Cpu, iconColor: "text-emerald-500" },
    { title: "Apartamentos", value: stats.apartamentos, icon: Users, iconColor: "text-purple-500" },
    { title: "Alertas de Vazamento", value: stats.vazamentos, icon: Droplet, iconColor: "text-red-500" }
  ];

  if (loading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {cardsData.map((card) => (
          <Card key={card.title} className="p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </Card>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {error && <p className="col-span-4 text-red-500">{error}</p>}
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between -mt-6">
              <p className="font-bold text-4xl text-foreground">{card.value}</p>
              <Icon className={`w-8 h-8 ${card.iconColor}`} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
