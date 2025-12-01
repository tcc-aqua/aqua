import { Mailbox, Send, MessageSquare, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

const cardsData = [
    {
        title: "Mensagens Recebidas",
        value: 48,
        icon: Mailbox, // Ícone mais adequado para "Recebidas"
        iconColor: "text-blue-600",
    },
    {
        title: "Mensagens Enviadas",
        value: 42, // Removendo "m³" se for uma contagem de mensagens
        icon: Send, // Ícone mais adequado para "Enviadas"
        iconColor: "text-emerald-600",
    },
    {
        title: "Total de Interações",
        value: 120,
        icon: MessageSquare, // Ícone para total de conversas/mensagens
        iconColor: "text-purple-600",
    },
    {
        title: "Admin. (Global)",
        value: 3,
        icon: Shield, // Ícone para administração/autoridade
        iconColor: "text-red-600",
    }
];

export default function CardsSuporte() {
    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {cardsData.map((card) => {
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
                                <p className="font-bold text-4xl text-foreground">
                                    {card.value}
                                </p>
                            </div>

                            {/* Aumentando o tamanho do ícone para 7 e usando bg/10 para destaque */}
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