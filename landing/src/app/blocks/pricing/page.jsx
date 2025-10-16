"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CircleCheck, CircleHelp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const tooltipContent = {
  styles: "Escolha diferentes modos de exibição dos dados no aplicativo.",
  filters: "Aplique filtros por período, local ou tipo de consumo.",
  credits: "Use esses créditos para solicitar relatórios personalizados.",
};

const plansResidenciais = [
  {
    name: "Essencial",
    price: 19,
    description:
      "Ideal para residências pequenas. Acompanhe consumo básico e receba alertas de desperdício.",
    features: [
      { title: "Atualização a cada 15 minutos" },
      { title: "Histórico de 30 dias" },
      { title: "2 modos de visualização", tooltip: tooltipContent.styles },
      { title: "Filtros simples por dia e semana", tooltip: tooltipContent.filters },
      { title: "2 créditos para relatórios", tooltip: tooltipContent.credits },
    ],
  },
  {
    name: "Consciente",
    price: 29,
    isRecommended: true,
    description:
      "Mais controle para famílias: vazamentos detectados automaticamente e comparativo com vizinhos.",
    features: [
      { title: "Atualização a cada 5 minutos" },
      { title: "Histórico de 6 meses" },
      { title: "5 modos de visualização", tooltip: tooltipContent.styles },
      { title: "Filtros avançados por período", tooltip: tooltipContent.filters },
      { title: "5 créditos para relatórios", tooltip: tooltipContent.credits },
    ],
    isPopular: true,
  },
  {
    name: "Completo",
    price: 49,
    description:
      "Para quem quer total controle: integração com assistentes virtuais e metas personalizadas.",
    features: [
      { title: "Atualização em tempo real" },
      { title: "Histórico ilimitado" },
      { title: "10 modos de visualização", tooltip: tooltipContent.styles },
      { title: "Filtros personalizados por uso e horário", tooltip: tooltipContent.filters },
      { title: "10 créditos para relatórios", tooltip: tooltipContent.credits },
    ],
  },
];

const plansCondominio = [
  {
    name: "Básico",
    price: 99,
    description:
      "Monitore até 10 unidades com relatórios simples e alertas de vazamento por residência.",
    features: [
      { title: "Atualização a cada 15 minutos" },
      { title: "Histórico de 3 meses" },
      { title: "Painel coletivo por bloco", tooltip: tooltipContent.styles },
      { title: "Filtros por unidade e período", tooltip: tooltipContent.filters },
      { title: "5 créditos para relatórios mensais", tooltip: tooltipContent.credits },
    ],
  },
  {
    name: "Gestor",
    price: 199,
    isRecommended: true,
    description:
      "Ideal para síndicos: acompanha até 30 unidades, detecta vazamentos e gera metas coletivas.",
    features: [
      { title: "Atualização a cada 5 minutos" },
      { title: "Histórico de 12 meses" },
      { title: "Painel por unidade e consumo total", tooltip: tooltipContent.styles },
      { title: "Filtros por morador, bloco e data", tooltip: tooltipContent.filters },
      { title: "15 créditos para relatórios detalhados", tooltip: tooltipContent.credits },
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: 349,
    description:
      "Condomínios grandes: suporte dedicado, integração com sistemas de gestão e automações.",
    features: [
      { title: "Atualização em tempo real" },
      { title: "Histórico ilimitado" },
      { title: "Dashboard multi-condomínio", tooltip: tooltipContent.styles },
      { title: "Filtros avançados e exportação via API", tooltip: tooltipContent.filters },
      { title: "Relatórios ilimitados e personalizados", tooltip: tooltipContent.credits },
    ],
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

const PlanCard = ({ plan }) => (
  <motion.div
    variants={itemVariants}
    transition={{ type: "tween", duration: 0.4 }}
    className={cn("relative p-6 bg-background border px-8", {
      "shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] py-14 z-1 px-10 lg:-mx-2 overflow-hidden dark:bg-[#084266] border border-pr":
        plan.isPopular,
    })}
  >
    {plan.isPopular && (
      <Badge className="absolute top-10 right-10 rotate-45 rounded-none px-10 uppercase translate-x-1/2 -translate-y-1/2">
        Mais Popular
      </Badge>
    )}
    <h3 className="text-lg font-medium">{plan.name}</h3>
    <p className="mt-2 text-4xl font-bold">
      R${plan.price}
      <span className="ml-1.5 text-sm text-muted-foreground font-normal">
        /mês
      </span>
    </p>
    <p className="mt-4 font-medium text-muted-foreground">
      {plan.description}
    </p>

    <Button
      variant={plan.isPopular ? "default" : "outline"}
      size="lg"
      asChild
      className="w-full mt-6 rounded-full text-base cursor-pointer"
    >
      <Link href="#contato">
      Começar agora <ArrowUpRight className="w-4 h-4 " />
       </Link>
    </Button>
    <Separator className="my-8" />
    <ul className="space-y-3">
      {plan.features.map((feature) => (
        <li key={feature.title} className="flex items-start gap-1.5">
          <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
          {feature.title}
          {feature.tooltip && (
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <CircleHelp className="h-4 w-4 mt-1 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>{feature.tooltip}</TooltipContent>
            </Tooltip>
          )}
        </li>
      ))}
    </ul>
  </motion.div>
);

const Pricing04 = () => {
  const [selectedCategory, setSelectedCategory] = useState("residencial");

  const plans =
    selectedCategory === "residencial" ? plansResidenciais : plansCondominio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:bg-background dark:bg-none flex flex-col items-center justify-center py-12 px-6"
    >
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-5xl sm:text-6xl font-semibold text-center tracking-tighter"
      >
        Planos
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mt-8"
        >
          <TabsList className="h-11 bg-background border rounded-full ">
            <TabsTrigger
              value="residencial"
              className="px-4 rounded-full data-[state=active]:bg-primary  data-[state=active]:text-primary-foreground cursor-pointer"
            >
              Residência
            </TabsTrigger>
            <TabsTrigger
              value="condominio"
              className="px-4 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
            >
              Condomínio
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={listVariants}
          className="mt-12 sm:mt-16 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8 lg:gap-0" 
        >
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Pricing04;