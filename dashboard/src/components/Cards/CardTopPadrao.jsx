'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

    const cardInfos = {
        "/": [
            { title: "Contratos Ativos", value: 12 },
            { title: "Clientes Cadastrados", value: 309 },
            { title: "Novos Usuários", value: 48 },
            { title: "Lucro Mensal", value: "R$ 5.300" },
        ],
        "/analytics": [
            { title: "Contratos Ativos", value: 12 },
            { title: "Clientes Cadastrados", value: 309 },
            { title: "Novos Usuários", value: 48 },
            { title: "Lucro Mensal", value: "R$ 5.300" },
        ],
        "/contractors": [
            { title: "Contratos Ativos", value: 12 },
            { title: "Clientes Cadastrados", value: 309 },
            { title: "Novos Usuários", value: 48 },
            { title: "Lucro Mensal", value: "R$ 5.300" },
        ],
        "/funcionarios": [
            { title: "Total de Funcionários", value: 12 },
            { title: "Clientes Cadastrados", value: 309 },
            { title: "Novos Usuários", value: 48 },
            { title: "Lucro Mensal", value: "R$ 5.300" },
        ],
        "/plans": [
            { title: "Contratos Ativos", value: 12 },
            { title: "Clientes Cadastrados", value: 309 },
            { title: "Novos Usuários", value: 48 },
            { title: "Lucro Mensal", value: "R$ 5.300" },
        ]
    }
    const cards = cardInfos[pathname] || []

    return (
        <section className="grid grid-cols-4 gap-4 mt-5 p-4">
            {cards.map((card, index) => (
                    <motion.div
                           variants={cardVariants}
                           initial="hidden"
                           animate="visible"
                           custom={0}
                         >
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-bold md:text-3xl text-xl">{card.value}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </section>
    )
}