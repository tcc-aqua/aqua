"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  HomeIcon,
  BuildingIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  LeafIcon,
  UsersIcon,
  ClockIcon,
  DollarSignIcon,
} from "lucide-react";

// BENEFÍCIOS PARA RESIDÊNCIAS INDIVIDUAIS
const residenceBenefits = [
  {
    icon: TrendingDownIcon,
    title: "Economia Direta",
    description: "Controle o consumo de água em tempo real e reduza gastos desnecessários em até 40%.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: AlertTriangleIcon,
    title: "Detecção de Vazamentos",
    description: "Receba alertas automáticos ao identificar picos de consumo ou possíveis vazamentos.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3Icon,
    title: "Consumo Sob Controle",
    description: "Visualize seu histórico de consumo e crie metas personalizadas mês a mês.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: LeafIcon,
    title: "Mais Sustentável",
    description: "Reduza seu impacto ambiental com hábitos conscientes e medição automatizada.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

// BENEFÍCIOS PARA CONDOMÍNIOS (SÍNDICOS / ADMINISTRADORES)
const condominiumBenefits = [
  {
    icon: UsersIcon,
    title: "Gestão Centralizada",
    description: "Gerencie todas as unidades do condomínio com relatórios automatizados e visão unificada.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3Icon,
    title: "Relatórios Inteligentes",
    description: "Visualize o consumo por bloco ou unidade e facilite a divisão justa da conta coletiva.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: ClockIcon,
    title: "Monitoramento Contínuo",
    description: "Acompanhe o uso de água em tempo real com alertas automáticos para anomalias.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: DollarSignIcon,
    title: "Redução de Custos",
    description: "Identifique desperdícios e otimize o uso coletivo de água para economizar recursos.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

// ANIMAÇÕES
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// COMPONENTE DE CARTÃO DE BENEFÍCIO
const BenefitCard = ({ icon: Icon, title, description, color, bg }) => (
  <motion.div
    variants={itemVariants}
    transition={{ type: "tween", duration: 0.4 }}
    className="h-full"
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white dark:bg-[#0a5280] border dark:border-primary">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 dark:bg-zinc-200`}>
          <Icon className={`w-6 h-6 ${color} `} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed dark:text-white">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

// COMPONENTE DE LISTA DE BENEFÍCIOS
const BenefitList = ({ benefits }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={benefits[0].title}
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={listVariants}
      >
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

// COMPONENTE PRINCIPAL
export default function AnimatedTabsDemo() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-20 lg:py-12"
    >
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6">
        <h2 className="text-5xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-center mb-15">
          Nossos Benefícios
        </h2>

        <Tabs defaultValue="residences" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-background p-0 rounded-md">
            <TabsTrigger
              value="residences"
              className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              <HomeIcon className="w-4 h-4" />
              Para Residências
            </TabsTrigger>
            <TabsTrigger
              value="condominiums"
              className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
            >
              <BuildingIcon className="w-4 h-4" />
              Para Condomínios
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 p-0">
            <TabsContent value="residences">
              <BenefitList benefits={residenceBenefits} />
            </TabsContent>
            <TabsContent value="condominiums">
              <BenefitList benefits={condominiumBenefits} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.section>
  );
}
