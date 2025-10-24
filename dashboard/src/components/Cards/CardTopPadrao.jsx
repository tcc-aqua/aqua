'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Briefcase, 
  BarChart2, 
  Activity, 
  TrendingUp, 
  Cpu, 
  SignalHigh, 
  AlertTriangle, 
  Clock, 
  Building, 
  Layers, 
  Home 
} from "lucide-react";


const cardVariants = {
    hidden: { y: -120, opacity: 0, zIndex: -1 },
    visible: (delay = 0) => ({
        y: 0,
        opacity: 1,
        zIndex: 10,
        transition: { duration: 0.8, ease: "easeOut", delay },
    }),
}

export default function CardTop() {
    const pathname = usePathname()

  const [userStats, setUserStats] = useState({ total: 0, ativos: 0, inativos: 0, novos: 0 });
const [sensorStats, setSensorStats] = useState({ total: 0, ativos: 0, alertas: 0, ultimaLeitura: "–" });

    useEffect(() => {
    async function fetchData() {
        if (pathname === "/users") {
            const totalRes = await fetch("/api/users/count");
            const total = await totalRes.json();
            const ativosRes = await fetch("/api/users/ativos");
            const ativosData = await ativosRes.json();
            const inativosRes = await fetch("/api/users/inativos");
            const inativosData = await inativosRes.json();
            const novos = ativosData.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length;

            setUserStats({ total, ativos: ativosData.length, inativos: inativosData.length, novos });
        }

        if (pathname === "/sensors") {
            const totalRes = await fetch("/api/sensors/count");
            const total = await totalRes.json();
            const ativosRes = await fetch("/api/sensors/ativos");
            const ativos = await ativosRes.json();
            const alertasRes = await fetch("/api/sensors/inativos");
            const alertas = await alertasRes.json();
            const ultimaLeituraRes = await fetch("/api/sensors/ultima");
            const ultimaLeitura = await ultimaLeituraRes.json();

            setSensorStats({ total, ativos, alertas, ultimaLeitura });
        }
    }

    fetchData();
}, [pathname]);

    const cardInfos = {

  "/dashboard": [
    { title: "Contratos Ativos", value: 12, icon: Briefcase, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
    { title: "Clientes Cadastrados", value: 309, icon: Users, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
    { title: "Novos Usuários", value: 48, icon: UserPlus, bg: "bg-purple-100 text-purple-600", darkBg: "bg-purple-900 text-purple-400" },
    { title: "Atendimentos em Andamento", value: 7, icon: Activity, bg: "bg-yellow-100 text-yellow-600", darkBg: "bg-yellow-900 text-yellow-400" },
  ],

  "/analytics": [
    { title: "Total de Acessos", value: 1200, icon: BarChart2, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
    { title: "Usuários Ativos", value: 310, icon: UserCheck, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
    { title: "Novos Cadastros", value: 48, icon: UserPlus, bg: "bg-purple-100 text-purple-600", darkBg: "bg-purple-900 text-purple-400" },
    { title: "Média de Engajamento", value: "82%", icon: TrendingUp, bg: "bg-orange-100 text-orange-600", darkBg: "bg-orange-900 text-orange-400" }, 
  ],

  "/users": [
        { title: "Total de Usuários", value: userStats.total, icon: Users, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
        { title: "Usuários Ativos", value: userStats.ativos, icon: UserCheck, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
        { title: "Novos Usuários (mês)", value: userStats.novos, icon: UserPlus, bg: "bg-purple-100 text-purple-600", darkBg: "bg-purple-900 text-purple-400" },
        { title: "Usuários Inativos", value: userStats.inativos, icon: UserX, bg: "bg-red-100 text-red-600", darkBg: "bg-red-900 text-red-400" },
      ],

  "/funcionarios": [
    { title: "Total de Funcionários", value: 42, icon: Users, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
    { title: "Funcionários Ativos", value: 38, icon: UserCheck, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
    { title: "Em Treinamento", value: 3, icon: Layers, bg: "bg-purple-100 text-purple-600", darkBg: "bg-purple-900 text-purple-400" },
    { title: "Em Férias", value: 1, icon: UserX, bg: "bg-yellow-100 text-yellow-600", darkBg: "bg-yellow-900 text-yellow-400" },
  ],

  "/plans": [
    { title: "Planos Disponíveis", value: 5, icon: Layers, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
    { title: "Planos Ativos", value: 3, icon: BarChart2, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
    { title: "Clientes com Plano", value: 309, icon: Users, bg: "bg-yellow-100 text-yellow-600", darkBg: "bg-yellow-900 text-yellow-400" },
  ],

  "/sensors": [
    { title: "Total de Sensores", value: sensorStats.total, icon: Cpu, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" }, // chip/sensor
    { title: "Sensores Ativos", value: sensorStats.ativos, icon: SignalHigh, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" }, // sinal funcionando
    { title: "Sensores com Alerta", value: sensorStats.inativos, icon: AlertTriangle, bg: "bg-red-100 text-red-600", darkBg: "bg-red-900 text-red-400" }, // alerta
    { title: "Última Leitura (média)", value: "há 2min", icon: Clock, bg: "bg-yellow-100 text-yellow-600", darkBg: "bg-yellow-900 text-yellow-400" }, // tempo
  ],

  "/condominios": [
    { title: "Total de Condomínios", value: 27, icon: Building, bg: "bg-blue-100 text-blue-600", darkBg: "bg-blue-900 text-blue-400" },
    { title: "Total de Apartamentos", value: 894, icon: Home, bg: "bg-purple-100 text-purple-600", darkBg: "bg-purple-900 text-purple-400" },
    { title: "Sensores Instalados", value: 421, icon: Cpu, bg: "bg-green-100 text-green-600", darkBg: "bg-green-900 text-green-400" },
    { title: "Alertas Ativos", value: 8, icon: AlertTriangle, bg: "bg-red-100 text-red-600", darkBg: "bg-red-900 text-red-400" },
  ],
};


const cards = cardInfos[pathname] || []

    return (   
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index * 0.2}
                        key={index}
                    >
                        <Card className={`shadow-md hover:shadow-lg transition-shadow p-4 ${card.bg}`}>
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center">
                                <Icon className="w-12 h-12 mb-2" />
                                <p className="font-bold md:text-3xl text-xl">{card.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </section>
    )
}