"use client"
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const Main = ({
    heading = "Monitoramento de água",
    subheading = " em tempo real",
    description = "Sistema inteligente que detecta vazamentos, reduz desperdícios e ajuda você a economizar até 40% na conta de água",
    buttons = {
        primary: {
            text: "Começar Agora",
            url: "#contato",
        },
        secondary: {
            text: "Veja os planos disponíveis",
            url: "#planos",
        },
    },
    image = {
        src: "./interface-app.jpg",
        alt: "Placeholder",
    },
}) => {
    return (
        <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 lg:py-12"
        >
            <div className="container flex flex-col items-center gap-10 lg:my-0 lg:flex-row">
                <div className="flex flex-col gap-7 lg:w-2/3">
                    <h2 className="text-5xl font-semibold text-foreground md:text-5xl lg:text-8xl">
                        <span>{heading}</span>
                        <span className="text-[#0084d1] ">{subheading}</span>
                    </h2>
                    <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
                        {description}
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            Detecção automática de vazamentos
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Alertas em tempo real
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            Economia comprovada
                        </div>
                    </motion.div>
                    <div className="flex flex-wrap items-start gap-5 lg:gap-7">
                        <Button asChild>
                            <a href={buttons.primary?.url}>
                                <div className="flex items-center gap-2">
                                    <ArrowUpRight className="size-4" />
                                </div>
                                <span className="pr-6 pl-4 text-sm whitespace-nowrap lg:pr-8 lg:pl-6 lg:text-base">
                                    {buttons.primary?.text}
                                </span>
                            </a>
                        </Button>
                        <Button asChild variant="link" className="underline">
                            <a href={buttons.secondary?.url}>{buttons.secondary?.text}</a>
                        </Button>
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="absolute top-2.5 left-1/2! h-[92%]! w-[69%]! -translate-x-[52%] overflow-hidden rounded-[35px]">
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="size-full object-cover object-[50%_0%]"
                        />
                    </div>
                    <img
                        className="relative z-10"
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mockups/phone-2.png"
                        width={450}
                        height={889}
                        alt="iphone"
                    />
                </div>
            </div>
        </motion.section>
    );
};

export { Main };
