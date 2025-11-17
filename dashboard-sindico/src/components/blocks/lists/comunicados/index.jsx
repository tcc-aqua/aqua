"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus } from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import AnimationWrapper from "../../../layout/Animation/Animation";
import { Bell, BellOff, Users, Shield } from "lucide-react";

export default function ComunicadosDashboard() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");

    const [novoComunicado, setNovoComunicado] = useState({
        titulo: "",
        assunto: "",
        destinatario: "usuarios",
    });

    const comunicados = [
        {
            id: 1,
            titulo: "Manutenção no Sistema",
            assunto:
                "O sistema ficará fora do ar das 02h às 03h para manutenção preventiva.",
            destinatario: "usuarios",
            status: "nao_lido",
        },
        {
            id: 2,
            titulo: "Reunião Geral",
            assunto: "Reunião obrigatória para administradores nesta sexta.",
            destinatario: "administradores",
            status: "lido",
        },
    ];

    const total = comunicados.length;
    const naoLidos = comunicados.filter(c => c.status === "nao_lido").length;
    const paraUsuarios = comunicados.filter(c => c.destinatario === "usuarios").length;
    const paraAdmins = comunicados.filter(c => c.destinatario === "administradores").length;

    const cardsData = [
        {
            title: "Total de Comunicados",
            value: total,
            icon: Bell,
            iconColor: "text-blue-500",
            porcentagem: "Visão Geral",
        },
        {
            title: "Não Lidos",
            value: naoLidos,
            icon: BellOff,
            iconColor: "text-red-500",
            subTitle1: naoLidos > 0 ? `${naoLidos} pendentes` : "Nenhum pendente",
        },
        {
            title: "Para Usuários",
            value: paraUsuarios,
            icon: Users,
            iconColor: "text-green-500",
            subTitle2: "Comunicados gerais",
        },
        {
            title: "Para Administradores",
            value: paraAdmins,
            icon: Shield,
            iconColor: "text-purple-500",
            subTitle: "Gestão interna",
        },
    ];

    const comunicadosFiltrados = comunicados.filter((c) => {
        if (filtro === "lidos") return c.status === "lido";
        if (filtro === "nao_lidos") return c.status === "nao_lido";
        if (filtro === "administradores") return c.destinatario === "administradores";
        if (filtro === "usuarios") return c.destinatario === "usuarios";
        return true;
    });

    return (
        <div className="container mx-auto mt-6 space-y-6">

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {cardsData.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <AnimationWrapper key={card.title} delay={i * 0.2}>
                            <Card className="hover:border-sky-400 dark:hover:border-sky-950">
                                <CardHeader>
                                    <CardTitle className="font-bold text-xl text-foreground">
                                        {card.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-row items-center justify-between -mt-6">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-4xl text-foreground">{card.value}</p>

                                        {card.subTitle1 && (
                                            <p className="text-red-500 text-sm mt-1">{card.subTitle1}</p>
                                        )}

                                        {card.porcentagem && (
                                            <p className="text-blue-500 text-sm mt-1">{card.porcentagem}</p>
                                        )}

                                        {card.subTitle && (
                                            <p className="text-purple-500 text-sm mt-1">{card.subTitle}</p>
                                        )}

                                        {card.subTitle2 && (
                                            <p className="text-green-600 text-sm mt-1">{card.subTitle2}</p>
                                        )}
                                    </div>

                                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    );
                })}
            </section>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Comunicados</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2">
                            <Plus size={18} /> Criar Comunicado
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Comunicado</DialogTitle>
                            <DialogDescription>
                                Preencha as informações para criar um novo comunicado.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título</label>
                                <Input
                                    placeholder="Digite o título..."
                                    value={novoComunicado.titulo}
                                    onChange={(e) =>
                                        setNovoComunicado({ ...novoComunicado, titulo: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto</label>
                                <Textarea
                                    placeholder="Digite o assunto..."
                                    value={novoComunicado.assunto}
                                    onChange={(e) =>
                                        setNovoComunicado({ ...novoComunicado, assunto: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destinatário</label>
                                <Select
                                    value={novoComunicado.destinatario}
                                    onValueChange={(v) =>
                                        setNovoComunicado({ ...novoComunicado, destinatario: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usuarios">Usuários</SelectItem>
                                        <SelectItem value="administradores">Administradores</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setOpen(false)}>Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={filtro} onValueChange={setFiltro}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="administradores">Não Lidos</TabsTrigger>
                    <TabsTrigger value="usuarios">Lidas</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Comunicados</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {comunicadosFiltrados.map((c) => (
                            <div key={c.id} className="flex items-center py-4 gap-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500/10">
                                    <Bell className="w-5 h-5 text-sky-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{c.titulo}</p>
                                    <p className="text-sm text-muted-foreground truncate">{c.assunto}</p>
                                </div>

                                <div className="w-36 text-sm text-center">
                                    {c.destinatario === "administradores" ? "Administradores" : "Usuários"}
                                </div>

                                

                                <div className="w-40 text-sm text-center">
                                    {c.criado_em
                                        ? new Date(c.criado_em).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "-"}
                                </div>

                                <div className="flex gap-2 ml-auto">
                                    <Button size="icon" variant="ghost">
                                        <Pencil size={16} />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-600">
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
