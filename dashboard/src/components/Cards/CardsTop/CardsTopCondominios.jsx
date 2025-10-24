"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Building, AlertTriangle } from "lucide-react";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function CardTopUsers() {
  const [userStats, setUserStats] = useState({
    total: 0,
    ativos: 0,
    sindicos: 0,
    alertas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Todos os usuários
        const resUsers = await fetch("http://localhost:3333/api/users");
        const dataUsers = await resUsers.json();
        const users = dataUsers.docs || [];

        // Usuários ativos
        const resAtivos = await fetch("http://localhost:3333/api/users/ativos");
        const dataAtivos = await resAtivos.json();
        const ativos = dataAtivos.docs || [];

        // Síndicos
        const resSindicos = await fetch("http://localhost:3333/api/users");
        const dataSindicos = await resSindicos.json();
        const sindicos = (dataSindicos.docs || []).filter(u => u.role === "sindico");

        // Alertas
        const resAlertas = await fetch("http://localhost:3333/api/alertas");
        const dataAlertas = await resAlertas.json();
        const alertas = dataAlertas.docs || [];

        setUserStats({
          total: users.length,
          ativos: ativos.length,
          sindicos: sindicos.length,
          alertas: alertas.length,
        });
      } catch (err) {
        console.error("Erro ao buscar stats:", err);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 500);
    return () => clearInterval(interval);

  }, []);

  const cards = [
    { title: "Todos os Usuários", value: userStats.total, icon: Users, bg: "bg-blue-300" },
    { title: "Usuários Ativos", value: userStats.ativos, icon: UserCheck, bg: "bg-green-300" },
    { title: "Síndicos", value: userStats.sindicos, icon: Building, bg: "bg-purple-300" },
    { title: "Usuários com Alerta", value: userStats.alertas, icon: AlertTriangle, bg: "bg-red-300" }
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div key={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card className={`p-4 ${card.bg}`}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Icon className="w-10 h-10 mb-2" />
                <p className="font-bold text-xl">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
