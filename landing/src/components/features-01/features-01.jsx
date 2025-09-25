import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: Settings2,
    title: "Contas Altas Inexplicáveis",
    description:
      "Moradores enfrentam aumentos de até 300% na conta de água sem saber o motivo",
  },
  {
    icon: Blocks,
    title: "Vazamentos Silenciosos",
    description:
      "Perda de água não detectada resulta em desperdício e prejuízo financeiro",
  },
  {
    icon: Bot,
    title: "Falta de Controle",
    description:
      "Impossibilidade de monitorar o consumo real e identificar padrões",
  },
  {
    icon: Film,
    title: "Desperdício Financeiro",
    description:
      "Familias gastam em média R$ 2.400 por ano a mais devido à falta de controle",
  },
  
];

const Features01Page = () => {
  return (
    <div className="mt-30 flex  items-center justify-center ">
      <div>
        <h1 className="text-5xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-center">
        O Problema é Real e <span className="text-[#0084d1]">Caro</span>
        </h1>
        <div
          className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-2   gap-6 max-w-(--breakpoint-lg) mx-auto px-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col bg-[#eff6ff] border shadow-inner rounded-xl py-6 px-5">
              <div
                className="mb-4 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="size-5" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features01Page;
