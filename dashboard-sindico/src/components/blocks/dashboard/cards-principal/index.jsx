"use client";

import { useEffect, useState } from "react";
import { Home, Cpu, Users, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { api } from "@/lib/api";

export default function CardsPrincipal() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await api.get("/dashboard");

      if (!res || res.error) {
        console.error("Erro ao carregar dashboard:", res);
        return;
      }

      setInfo(res);
    }

    loadData();
  }, []);

  if (!info)
    return (
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4">
          <p>Carregando dados...</p>
        </Card>
      </section>
    );

  const cardsData = [
    {
      title: "Apartamentos Ativos",
      value: info.apartamentosAtivos ?? 3,
      icon: Home,
      iconColor: "text-blue-500",
    },
    {
      title: "Sensores Ativos",
      value: info.sensoresAtivos ?? 3,
      icon: Cpu,
      iconColor: "text-green-500",
    },

    {
        title: "Consumo Total",
        value: `300L`,
        icon: Droplet,
        iconColor: "text-sky-500",
      }
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {cardsData.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="hover:border-sky-400 dark:hover:border-sky-950"
          >
            <CardHeader>
              <CardTitle className="font-bold text-xl text-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row items-center justify-between -mt-6">
              <div className="flex flex-col">
                <p className="font-bold text-4xl text-foreground">
                  {card.value}
                </p>
              </div>

              <Icon className={`w-8 h-8 ${card.iconColor}`} />
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
