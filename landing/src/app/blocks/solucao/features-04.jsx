"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Wallet,
  SearchCheck,
  Home,
  Timer,
  RefreshCw,
  HeartHandshake,
  QuoteIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Economia Comprovada",
    description:
      "Conta de água reduzida em 40% em 6 meses de implantação do sistema",
  },
  {
    icon: SearchCheck,
    title: "12 Vazamentos Detectados",
    description:
      "Problemas identificados que causavam desperdício invisível",
  },
  {
    icon: Home,
    title: "240 Famílias Beneficiadas",
    description:
      "Todas as unidades com monitoramento individualizado",
  },
  {
    icon: Timer,
    title: "4 Meses para ROI",
    description:
      "Tempo recorde para o investimento se pagar sozinho.",
  },
  {
    icon: RefreshCw,
    title: "114 Dias para Payback",
    description:
      "Investimento recuperado em menos de 4 meses",
  },
  {
    icon: HeartHandshake,
    title: "18 Condomínios Vizinhos Impactados",
    description:
      "Replicação do modelo na região após nosso sucesso",
  },
];

const Features04Page = () => {
  return (
    <div className="flex bg-background items-center justify-center">
      <div className="max-w-screen-lg w-full py-12 px-6 mx-auto">

        {/* TÍTULO COM ANIMAÇÃO DE CIMA */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl md:leading-14 lg:text-6xl text-center font-semibold tracking-[-0.03em] max-w-3xl mx-auto">
            Condomínio Nova Aurora:
          </h1>
          <h2 className="text-4xl text-[#0084d1] md:text-5xl md:leading-14 lg:text-6xl text-center font-semibold tracking-[-0.03em] max-w-3xl mx-auto">
            Transformação Real
          </h2>
        </motion.div>

        <div className="mt-6 md:mt-10 w-full mx-auto grid md:grid-cols-2 gap-12 items-start">

          {/* ACCORDION COM ANIMAÇÃO DA ESQUERDA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion
              defaultValue="item-0"
              type="single"
              className="w-full items-center"
            >
              {features.map(({ title, description, icon: Icon }, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group/accordion-item items-center data-[state=open]:border-b-2 data-[state=open]:border-primary"
                >
                  <AccordionTrigger className="text-lg [&>svg]:hidden group-first/accordion-item:pt-0 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-primary" />
                      {title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
                    {description}
                    <div className="mt-6 mb-2 md:hidden aspect-video w-full bg-muted rounded-xl" />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CARD DE DEPOIMENTO COM ANIMAÇÃO DA DIREITA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white dark:bg-background border-2 border-slate-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-background rounded-full flex items-center justify-center">
                    <QuoteIcon className="w-6 h-6 text-blue-600 " />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">
                      O Problema
                    </h3>
                    <p className="text-slate-600 dark:text-white">
                      "Estávamos enfrentando aumentos absurdos nas contas de água.
                      Algumas unidades tinham aumentos de 300% sem explicação.
                      Precisávamos de uma solução urgente."
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-slate-400 dark:text-white" />
                    <span className="text-slate-700 dark:text-white">
                      São Paulo, SP - Zona Sul
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-5 h-5 text-slate-400 dark:text-white" />
                    <span className="text-slate-700 dark:text-white">
                      240 famílias • 960 pessoas
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-white" />
                    <span className="text-slate-700 dark:text-white">
                      Implementação: Janeiro 2024
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-800 font-medium italic dark:text-white">
                    "Em 6 meses, nossa economia foi de R$ 140 mil. O sistema se pagou
                    em menos de 4 meses. Todos os moradores estão satisfeitos."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MA</span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Miguel Andrade
                      </div>
                      <div className="text-sm text-slate-600 dark:text-white">
                        Síndico, Nova Aurora
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features04Page;
