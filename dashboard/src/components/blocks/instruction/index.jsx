"use client";

import { useState } from "react";
import TabsShadowDemo from "@/components/tabs-11";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const tabsData = [
    {
        value: "consumo-diario",
        title: "Consumo Diário",
        img: "./gota-feliz.svg",
        description:
            "Acompanhe seu consumo diário e veja como pequenos ajustes podem reduzir o desperdício de água.",
    },
    {
        value: "consumo-mensal",
        title: "Consumo Mensal",
        img: "./gota-nerd.svg",
        description: "Visualize o total consumido no mês e compare com o período anterior.",
    },
    {
        value: "meta-economia",
        title: "Meta de Economia",
        img: "./gota-zen.svg",
        description: "Defina uma meta de economia e acompanhe seu progresso em tempo real.",
    },
    {
        value: "alertas",
        title: "Alertas e Vazamentos",
        img: "./gota-pulando.svg",
        description:
            "Receba alertas automáticos quando um vazamento for detectado ou o consumo ultrapassar o limite esperado.",
    },
];

export function Instruction() {
    const [currentTab, setCurrentTab] = useState(tabsData[0].value);

    function goPrevious() {
        const currentIndex = tabsData.findIndex((t) => t.value === currentTab);
        if (currentIndex > 0) setCurrentTab(tabsData[currentIndex - 1].value);
    }

    function goNext() {
        const currentIndex = tabsData.findIndex((t) => t.value === currentTab);
        if (currentIndex < tabsData.length - 1) setCurrentTab(tabsData[currentIndex + 1].value);
    }

    const currentItem = tabsData.find((t) => t.value === currentTab);

    return (
        <AlertDialog
            onOpenChange={(isOpen) => {
                // sempre que o modal for fechado, resetar para a primeira tab
                if (!isOpen) {
                    setCurrentTab(tabsData[0].value);
                }
            }}
        >
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="p-2 h-auto bg-transparent hover:bg-transparent cursor-pointer"
                >
                    <Info className="h-16 w-16 text-white hover:text-gray-300 transition-colors" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="flex flex-col items-center text-center gap-6">
                <AlertDialogCancel
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition"
                    asChild
                >
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 cursor-pointer">
                        x
                    </Button>
                </AlertDialogCancel>

                <div className="flex justify-center ">
                    <TabsShadowDemo value={currentTab} onValueChange={setCurrentTab} />
                </div>

                <AlertDialogHeader className="flex flex-col items-center gap-3">
                    {currentItem?.img && (
                        <img
                            src={currentItem.img}
                            alt={currentItem.title}
                            className="w-50 h-50 object-contain"
                        />
                    )}

                    <AlertDialogTitle className="text-xl font-semibold">
                        {currentItem?.title || "O que é o Aqua?"}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-base text-muted-foreground">
                        {currentItem?.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-between w-full">
                    <Button
                        variant="outline"
                        onClick={goPrevious}
                        disabled={currentTab === tabsData[0].value}
                        className="cursor-pointer"
                    >
                        Anterior
                    </Button>

                    <Button
                        onClick={goNext}
                        disabled={currentTab === tabsData[tabsData.length - 1].value}
                        className="cursor-pointer"
                    >
                        Próximo
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
