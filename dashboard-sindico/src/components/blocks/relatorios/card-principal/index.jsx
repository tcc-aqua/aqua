import { Home, Cpu, Users, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

const cardsData = [
    {
        title: "Consumo Alto",
        value: 48, 
        icon: Home,
        iconColor: "text-blue-500",
    },
    {
        title: "Consumo Médio",
        value: 42,
        icon: Cpu,
        iconColor: "text-green-500",
    },
    {
        title: "Apartamentos",
        value: 120,
        icon: Users,
        iconColor: "text-purple-500",
    },
    {
        title: "Alertas de Vazamento",
        value: 3, // número de alertas ativos
        icon: Droplet,
        iconColor: "text-red-500",
    }
];

export default function CardsRelatorio() {
    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
