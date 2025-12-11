'use client';
import { useEffect, useState } from "react";

import { Home, Cpu, Users, Droplet, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { api } from "@/lib/api"; 

export default function CardsPrincipal() {
    const [stats, setStats] = useState({
        total: 0,
        ativos: 0,
        inativos: 0,
        alerta: 2,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            setError(null);
            try {
                const path = `/moradores`; 
                
                const response = await api.get(path);
                
                if (response && !response.error) {
                    
                    setStats({
                        total: response.count_users || 0, 
                        ativos: response.users_ativos || 0,
                        inativos: response.users_inativos || 0,
                        alerta: response.users_with_alert || 2,
                    });
                } else if (response && response.error) {
                    setError(response.message || "Erro ao buscar estatísticas.");
                }
            } catch (err) {
                console.error("Erro inesperado ao buscar estatísticas:", err);
                setError("Falha na comunicação com o servidor.");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []); 

    const cardsData = [
        {
            title: "Total Moradores",
            value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total, 
            icon: Home,
            iconColor: "text-blue-500",
        },
        {
            title: "Ativos",
            value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.ativos, 
            icon: Cpu,
            iconColor: "text-green-500",
        },
        {
            title: "Inativos",
            value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.inativos, 
            icon: Users,
            iconColor: "text-purple-500",
        },
        {
            title: "Com Alerta",
            value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.alerta, 
            icon: Droplet,
            iconColor: "text-sky-500",
        }
    ];

    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {error && <p className="col-span-4 p-4 text-destructive">❌ {error}</p>}
            
            {cardsData.map((card) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title} className="hover:border-sky-400 dark:hover:border-sky-950">
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