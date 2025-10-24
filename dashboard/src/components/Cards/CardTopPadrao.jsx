'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Users, UserCheck, UserX, UserPlus, Cpu, SignalHigh, AlertTriangle, Hammer, Building, Home } from "lucide-react";

const cardVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function CardTop() {
  const pathname = usePathname();

  const [userStats, setUserStats] = useState({ total: 0, ativos: 0, inativos: 0, novos: 0 });
  const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, inativos: 0 });
  const [condominioStats, setCondominioStats] = useState({ total: 0, unidades: 0, sensoresAtivos: 0, alertas: 0 });
  const [casaStats, setCasaStats] = useState({ total: 0, moradores: 0, sensoresAtivos: 0, alertas: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        if (pathname === "/users") {
          const res = await fetch("http://localhost:3333/api/users");
          const data = await res.json();
          const docs = data.docs || data || [];
          setUserStats({
            total: docs.length,
            ativos: docs.filter(u => u.status === "ativo").length,
            inativos: docs.filter(u => u.status === "inativo").length,
            novos: docs.filter(u => new Date(u.criado_em).getMonth() === new Date().getMonth()).length
          });
        }

        if (pathname === "/sensors") {
          const res = await fetch("http://localhost:3333/api/sensores");
          const data = await res.json();
          const docs = data.docs || data || [];
          setSensorStats({
            total: docs.length,
            ativos: docs.filter(s => s.status === "ativo").length,
            inativos: docs.filter(s => s.status === "inativo").length
          });
        }

        if (pathname === "/condominios") {
          const res = await fetch("http://localhost:3333/api/condominios");
          const data = await res.json();
          const docs = data.docs || data || [];

          // Contagem de unidades e sensores ativos nos apartamentos
          let unidades = 0;
          let sensoresAtivos = 0;
          let alertas = 0;

          for (let cond of docs) {
            if (cond.apartamentos) {
              unidades += cond.apartamentos.length;
              sensoresAtivos += cond.apartamentos.filter(a => a.status === "ativo").length;
            }
            if (cond.alertas) alertas += cond.alertas.length;
          }

          setCondominioStats({
            total: docs.length,
            unidades,
            sensoresAtivos,
            alertas
          });
        }

        if (pathname === "/casas") {
          const res = await fetch("http://localhost:3333/api/casas");
          const data = await res.json();
          const docs = data.docs || data || [];

          setCasaStats({
            total: docs.length,
            moradores: docs.reduce((acc, c) => acc + (c.numero_moradores || 0), 0),
            sensoresAtivos: docs.filter(c => c.status === "ativo").length,
            alertas: docs.filter(c => c.status === "inativo").length
          });
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }

    fetchData();
  }, [pathname]);

  const cards = {
      "/users": [
    { title: "Todos os Usuários", value: userStats.total, icon: Users, bg: "bg-blue-100" },
    { title: "Usuários Ativos", value: userStats.ativos, icon: UserCheck, bg: "bg-green-100" },
    { title: "Síndicos", value: userStats.sindicos, icon: Building, bg: "bg-purple-100" },
    { title: "Usuários com Alerta", value: userStats.alertas, icon: AlertTriangle, bg: "bg-red-100" }
  ],
  "/sensors": [
    { title: "Total Sensores", value: sensorStats.total, icon: Cpu, bg: "bg-blue-100" },
    { title: "Sensores Ativos", value: sensorStats.ativos, icon: SignalHigh, bg: "bg-green-100" },
    { title: "Em Manutenção", value: sensorStats.manutencao, icon: Hammer, bg: "bg-yellow-100" },
    { title: "Alertas Ativos", value: sensorStats.alertas, icon: AlertTriangle, bg: "bg-red-100" }
  ],
  "/condominios": [
    { title: "Total Condomínios", value: condominioStats.total, icon: Building, bg: "bg-blue-100" },
    { title: "Unidades Totais", value: condominioStats.unidades, icon: Home, bg: "bg-green-100" },
    { title: "Sensores Ativos", value: condominioStats.sensoresAtivos, icon: SignalHigh, bg: "bg-yellow-100" },
    { title: "Alertas Ativos", value: condominioStats.alertas, icon: AlertTriangle, bg: "bg-red-100" }
  ],
  "/casas": [
    { title: "Total Casas", value: casaStats.total, icon: Building, bg: "bg-blue-100" },
    { title: "Total Moradores", value: casaStats.moradores, icon: Users, bg: "bg-green-100" },
    { title: "Sensores Ativos", value: casaStats.sensoresAtivos, icon: SignalHigh, bg: "bg-yellow-100" },
    { title: "Alertas Ativos", value: casaStats.alertas, icon: AlertTriangle, bg: "bg-red-100" }
  ]

  }[pathname] || [];

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
