"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, UserPlus, AlertTriangle, Cpu, Siren, Check, Signal, Sigma, SigmaIcon, ListTodo, CircleGauge, ListOrdered, Layers } from "lucide-react";

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
    sensoresTotal: 0,
    usuariosAtivos: 0,
    alertasAtivos: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [residenciasRes, sensoresRes, usersRes, alertasRes] = await Promise.all([
          fetch("http://localhost:3333/api/residencias"),
          fetch("http://localhost:3333/api/sensores/count-ativos"),
          fetch("http://localhost:3333/api/users/count-ativos"),
          fetch("http://localhost:3333/api/alertas/count/ativos"),
        ]);

        const [dataResidencias, dataSensores, dataUsers, dataAlertas] = await Promise.all([
          residenciasRes.json(),
          sensoresRes.json(),
          usersRes.json(),
          alertasRes.json(),
        ]);



        const totalResidencias = dataResidencias.totalResidencias ?? 0;
        const totalCasas = dataResidencias.totalCasas ?? 0;
        const totalApartamentos = dataResidencias.totalApartamentos ?? 0;
        const sensoresAtivos = dataSensores ?? 0;
        const sensoresTotal = dataSensores ?? 0;
        const usuariosAtivos = dataUsers ?? 0;
        const alertasAtivos = dataAlertas.totalAlertasAtivos ?? 0;

        setUserStats({
          totalResidencias,
          totalCasas,
          totalApartamentos,
          sensoresAtivos,
          sensoresTotal,
          usuariosAtivos,
          alertasAtivos,
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
      icon: Layers,
      iconColor: "text-accent",
      detalhe: `${userStats.totalCasas} casas + ${userStats.totalApartamentos} aptos`,
      borderColor: " border-b-accent "
    },
    {
      title: "Sensores ativos",
      value: userStats.sensoresAtivos,
      icon: Check,
      iconColor: "text-green-600",
      detalhe1: `${userStats.sensoresAtivos} de ${userStats.sensoresTotal} operacionais`,
      borderColor: " border-b-green-600"

    },
    {
      title: "Usuários ativos",
      value: userStats.usuariosAtivos,
      icon: Check,
      iconColor: "text-green-600",
      detalhe2: "Total de Usuários",
      // `${userStats.totalCasas} moradores + ${userStats.totalApartamentos} síndicos`
      borderColor: " border-b-green-600 "
    },
    {
      title: "Alertas ativos",
      value: userStats.alertasAtivos,
      icon: Siren,
      iconColor: "text-red-500",
      detalhe3: "Precisa de atenção",
      borderColor: " border-b-red-500 "
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <Card className={`border-b-4 ${card.borderColor}`}>
              <CardHeader>
                <CardTitle className="font-bold text-xl text-foreground">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between -mt-6">
                <div className="flex items-center justify-between">

                  <p className="font-bold text-4xl text-black dark:text-white">
                    {String(card.value)}
                  </p>
                  <Icon className={`w-10 h-10 ${card.iconColor}`} />
                </div>
                {card.detalhe && (
                  <p className="text-sm text-accent mt-2">{card.detalhe}</p>
                )}
                {card.detalhe1 && (
                  <p className="text-green-600 text-sm mt-1">
                    {card.detalhe1}
                  </p>
                )}
                {card.detalhe2 && !card.valueAtivos && (
                  <p className="text-sm mt-1 text-green-600"> {card.detalhe2} </p>
                )}
                {card.detalhe3 && (
                  <p className="text-sm mt-1 text-destructive"> {card.detalhe3} </p>
                )}

              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
