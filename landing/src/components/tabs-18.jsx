"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircleIcon,
} from "lucide-react";



const residenceBenefits = [
  {
    icon: TrendingDownIcon,
    title: "Economia Comprovada",
    description: "Reduza sua conta de água em até 40% com monitoramento inteligente.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: AlertTriangleIcon,
    title: "Alertas Instantâneos",
    description: "Receba notificações imediatas sobre vazamentos ou consumo anômalo.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3Icon,
    title: "Controle Total",
    description: "Acompanhe seu consumo em tempo real e defina metas personalizadas.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: LeafIcon,
    title: "Sustentabilidade",
    description: "Contribua para preservação da água e reduza seu impacto ambiental.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const companiesBenefits = [
  {
    icon: UsersIcon,
    title: "Gestão Escalável",
    description: "Gerencie milhares de usuários com dashboard profissional e API completa.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BarChart3Icon,
    title: "Analytics Avançado",
    description: "Relatórios detalhados, filtragem por região e análise de sazonalidade.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: ClockIcon,
    title: "Operação 24/7",
    description: "Monitoramento contínuo com alertas automáticos para sua equipe.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: DollarSignIcon,
    title: "ROI Garantido",
    description: "Reduza custos operacionais e aumente satisfação dos clientes.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];



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


const BenefitCard = ({ icon: Icon, title, description, color, bg }) => (
  <motion.div
    variants={itemVariants}
    transition={{ type: "tween", duration: 0.4 }}
    className="h-full" 
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white dark:bg-background border border-slate-200">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);


const BenefitList = ({ benefits }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={benefits[0].title} 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={listVariants}
    >
      {benefits.map((benefit, index) => (
        <BenefitCard key={index} {...benefit} />
      ))}
    </motion.div>
  </AnimatePresence>
);

export default function AnimatedTabsDemo() {
  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6">
      <h2 className="text-5xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-center mb-15">
        Nossos Benefícios
      </h2>
      <Tabs defaultValue="residences" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-background p-0 rounded-md ">
          <TabsTrigger
            value="residences"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
          >
            <HomeIcon className="w-4 h-4" />
            Para Residências
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white  data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all cursor-pointer"
          >
            <BuildingIcon className="w-4 h-4" />
            Para Empresas
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 p-0">
       
          <TabsContent value="residences">
            <BenefitList benefits={residenceBenefits} />
          </TabsContent>
          <TabsContent value="companies">
            <BenefitList benefits={companiesBenefits} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}