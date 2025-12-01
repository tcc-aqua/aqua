"use client";

import { useState, useEffect, useCallback } from "react";
import { Mailbox, Send, MessageSquare, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { api } from "@/lib/api"; 

export default function CardsSuporte() {
    const [counts, setCounts] = useState({
        recebidas: 0,
        enviadas: 0,
        interacoes: 0,
        administrativo: 0,
        isLoading: true,
    });

    const loadCounts = useCallback(async () => {
        setCounts(prev => ({ ...prev, isLoading: true }));
        try {
            const [
                recebidasRes,
                enviadasRes,
                interacoesRes,
                administrativoRes,
            ] = await Promise.all([
                api.get('/suporte/recebidas'), 
                api.get('/suporte/enviadas'), 
                api.get('/suporte/total-interacoes'), 
                api.get('/suporte/admin'), 
            ]);

            setCounts({
                recebidas: recebidasRes?.total || 0,
                enviadas: enviadasRes?.total || 0,
                interacoes: interacoesRes?.total || 0,
                administrativo: administrativoRes?.total || 0,
                isLoading: false,
            });
        } catch (error) {
            console.error("Falha ao carregar contagens de suporte:", error);
            setCounts(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        loadCounts();
    }, [loadCounts]);


    const cardsData = [
        {
            title: "Recebidas",
            value: counts.recebidas,
            icon: Mailbox,
            iconColor: "text-blue-600",
        },
        {
            title: "Enviadas",
            value: counts.enviadas,
            icon: Send,
            iconColor: "text-emerald-600",
        },
        {
            title: "Total de Interações",
            value: counts.interacoes,
            icon: MessageSquare,
            iconColor: "text-purple-600",
        },
        {
            title: "Admin. (Global)",
            value: counts.administrativo,
            icon: Shield,
            iconColor: "text-red-600",
        }
    ];

    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {cardsData.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title} className="hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="font-semibold text-lg text-foreground/80 tracking-tight">
                                {card.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-row items-center justify-between -mt-1">
                            <div className="flex flex-col">
                                <p className="font-bold text-4xl text-foreground flex items-center">
                                    {counts.isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    ) : (
                                        card.value
                                    )}
                                </p>
                            </div>

                            <div className={`w-14 h-14 flex items-center justify-center rounded-full ${card.iconColor.replace('text', 'bg')}/10`}>
                                <Icon className={`w-7 h-7 ${card.iconColor}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}