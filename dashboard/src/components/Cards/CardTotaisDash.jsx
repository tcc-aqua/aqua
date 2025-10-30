'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, UserPlus, AlertTriangle, Cpu } from "lucide-react";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

export default function CardTopDash() {
  const [userStats, setUserStats] = useState({
    totalResidencias: 0,
    totalCasas: 0,
    totalApartamentos: 0,
    sensoresAtivos: 0,
    usuariosAtivos: 0,
    alertasAtivos: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          dataResidencias,
          dataSensores,
          dataUsers,
          dataAlertas
        ] = await Promise.all([
          fetch("http://localhost:3333/api/residencias").then(res => res.json()),
          fetch("http://localhost:3333/api/sensores/count-ativos").then(res => res.json()),
          fetch("http://localhost:3333/api/users/count-ativos").then(res => res.json()),
          fetch("http://localhost:3333/api/alertas/count-ativos").then(res => res.json())
        ]);

        // Log para depuração
        console.log("Residencias:", dataResidencias);
        console.log("Sensores:", dataSensores);
        console.log("Users:", dataUsers);
        console.log("Alertas:", dataAlertas);

        const totalResidencias = dataResidencias.totalResidencias ?? 0;
        const totalCasas = dataResidencias.totalCasas ?? 0;
        const totalApartamentos = dataResidencias.totalApartamentos ?? 0;

        const sensoresAtivos = Array.isArray(dataSensores)
          ? dataSensores.length
          : dataSensores.sensoresAtivos ?? 0;

        const usuariosAtivos = Array.isArray(dataUsers)
          ? dataUsers.filter(u => u.role === "sindico").length
          : dataUsers.sindicosAtivos ?? 0;

        const alertasAtivos = Array.isArray(dataAlertas)
          ? dataAlertas.length
          : dataAlertas.totalAlertas ?? 0;

        setUserStats({
          totalResidencias,
          totalCasas,
          totalApartamentos,
          sensoresAtivos,
          usuariosAtivos,
          alertasAtivos
        });

      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total de residências",
      value: userStats.totalResidencias,
      icon: Users,
      iconColor: "text-blue-700",
      detalhe: `${userStats.totalCasas} casas + ${userStats.totalApartamentos} aptos`,
    },
    {
      title: "Sensores Ativos",
      value: userStats.sensoresAtivos,
      icon: Cpu,
      iconColor: "text-green-700",
    },
    {
      title: "Usuários ativos",
      value: userStats.usuariosAtivos,
      icon: UserPlus,
      iconColor: "text-yellow-500",
    },
    {
      title: "Alertas Ativos",
      value: userStats.alertasAtivos,
      icon: AlertTriangle,
      iconColor: "text-red-700",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i * 0.2}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-xl text-foreground">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between -mt-6">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                  <Icon className={`w-10 h-10 ${card.iconColor}`} />
                </div>
                {card.detalhe && (
                  <p className="text-sm text-blue-600 mt-2">{card.detalhe}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
