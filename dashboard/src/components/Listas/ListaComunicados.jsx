"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus, Bell, BellOff, Users, Shield, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AnimationWrapper from "../Layout/Animation/Animation";
import { useComunicados } from "@/hooks/useComunicados";
import Loading from "../Layout/Loading/page";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

export default function ComunicadosDashboard() {

    const [filtro, setFiltro] = useState("todos");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedComunicado, setSelectedComunicado] = useState(null);
    const [novoComunicado, setNovoComunicado] = useState({
        title: "",
        subject: "",
        addressee: "usuários",
    });

    const { comunicados, loading, error, addComunicado, editComunicado, removeComunicado } = useComunicados();

    if (loading) return <Loading />;
    if (error) return <p className="text-destructive">Erro: {error}</p>;

    const comunicadoStats = {
        total: comunicados.length,
        lidos: 0,
        naoLidos: comunicados.filter(c => !c.lido).length,
        usuários: comunicados.filter(c => c.addressee === "usuários").length,
        administradores: comunicados.filter(c => c.addressee === "administradores").length,
    };


    const comunicadosFiltrados = comunicados.filter(c => {
        if (filtro === "administradores") return c.addressee === "administradores";
        if (filtro === "usuários") return c.addressee === "usuários";
        return true;
    });

    const cardsData = [
        { title: "Total de Comunicados", value: comunicadoStats.total, icon: Bell, iconColor: "text-blue-500", porcentagem: "Visão Geral" },
        { title: "Não Lidos", value: comunicadoStats.naoLidos, icon: BellOff, iconColor: "text-red-500", subTitle1: comunicadoStats.naoLidos > 0 ? `${comunicadoStats.naoLidos} pendentes` : "Nenhum pendente" },
        { title: "Para Usuários", value: comunicadoStats.usuários, icon: Users, iconColor: "text-green-500", subTitle2: "Comunicados gerais" },
        { title: "Para Administradores", value: comunicadoStats.administradores, icon: Shield, iconColor: "text-purple-500", subTitle: "Gestão interna" },
    ];

    return (
        <div className="container mx-auto mt-6 space-y-6">
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {cardsData.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <AnimationWrapper key={card.title} delay={i * 0.2}>
                            <Card className="hover:border-sky-400 dark:hover:border-sky-950">
                                <CardHeader>
                                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row items-center justify-between -mt-6">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-4xl text-foreground">{card.value}</p>
                                        {card.subTitle1 && <p className="text-red-500 text-sm mt-1">{card.subTitle1}</p>}
                                        {card.porcentagem && <p className="text-blue-500 text-sm mt-1">{card.porcentagem}</p>}
                                        {card.subTitle && <p className="text-purple-500 text-sm mt-1">{card.subTitle}</p>}
                                        {card.subTitle2 && <p className="text-green-600 text-sm mt-1">{card.subTitle2}</p>}
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

                <Button className="flex gap-2" onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} /> Criar Comunicado
                </Button>
            </div>

            <Tabs value={filtro} onValueChange={setFiltro}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="administradores">Administradores</TabsTrigger>
                    <TabsTrigger value="usuários">Usuários</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Comunicados</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {comunicadosFiltrados.map(c => (
                            <div key={c.id} className="flex items-center py-4 gap-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500/10">
                                    <Bell className="w-5 h-5 text-sky-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{c.title}</p>
                                    <p className="text-sm text-muted-foreground truncate">{c.subject}</p>
                                </div>
                                <div className="w-36 text-sm text-center">{c.addressee === "administradores" ? "Administradores" : "Usuários"}</div>
                                <div className="w-40 text-sm text-center">{c.criado_em ? new Date(c.criado_em).toLocaleString("pt-BR") : "-"}</div>
                                <div className="flex gap-2 ml-auto">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedComunicado(c);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Editar</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-600"
                                                onClick={() => {
                                                    setSelectedComunicado(c);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Excluir</TooltipContent>
                                    </Tooltip>

                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>



                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                    <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
                        <div className="h-2 w-full rounded-t-md bg-primary" />
                        <DialogHeader className="flex items-center space-x-2 pb-2 mt-3">
                            <Plus className="h-5 w-5 text-primary" />
                            <DialogTitle className="text-xl font-bold text-accent">Novo Comunicado</DialogTitle>
                        </DialogHeader>

                        <form className="space-y-4 mt-4 px-4">
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Título</label>
                                    <Input
                                        placeholder="Digite o título..."
                                        value={novoComunicado.title}
                                        onChange={(e) =>
                                            setNovoComunicado({ ...novoComunicado, title: e.target.value })
                                        }
                                        className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Assunto</label>
                                    <Textarea
                                        placeholder="Digite o assunto..."
                                        value={novoComunicado.subject}
                                        onChange={(e) =>
                                            setNovoComunicado({ ...novoComunicado, subject: e.target.value })
                                        }
                                        className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Destinatário</label>
                                    <Select
                                        value={novoComunicado.addressee}
                                        onValueChange={(v) =>
                                            setNovoComunicado({ ...novoComunicado, addressee: v })
                                        }
                                    >
                                        <SelectTrigger className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usuários">Usuários</SelectItem>
                                            <SelectItem value="administradores">Administradores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="pt-4 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-32 border-border text-foreground hover:bg-muted"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={async () => {
                                        await addComunicado(novoComunicado);
                                        setShowCreateModal(false);
                                    }}
                                >
                                    Salvar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Editar */}
                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
                        <div className="h-2 w-full rounded-t-md bg-primary" />
                        <DialogHeader className="flex items-center space-x-2 pb-2 mt-3">
                            <Edit className="h-5 w-5 text-primary" />
                            <DialogTitle className="text-xl font-bold text-accent">Editar Comunicado</DialogTitle>
                        </DialogHeader>

                        <form className="space-y-4 mt-4 px-4">
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Título</label>
                                    <Input
                                        value={selectedComunicado?.title || ""}
                                        onChange={(e) =>
                                            setSelectedComunicado({ ...selectedComunicado, title: e.target.value })
                                        }
                                        className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Assunto</label>
                                    <Textarea
                                        value={selectedComunicado?.subject || ""}
                                        onChange={(e) =>
                                            setSelectedComunicado({ ...selectedComunicado, subject: e.target.value })
                                        }
                                        className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground mb-1">Destinatário</label>
                                    <Select
                                        value={selectedComunicado?.addressee || "usuários"}
                                        onValueChange={(v) =>
                                            setSelectedComunicado({ ...selectedComunicado, addressee: v })
                                        }
                                    >
                                        <SelectTrigger className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usuários">Usuários</SelectItem>
                                            <SelectItem value="administradores">Administradores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="pt-4 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-32 border-border text-foreground hover:bg-muted"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={async () => {
                                        await editComunicado(selectedComunicado.id, selectedComunicado);
                                        setShowEditModal(false);
                                    }}
                                >
                                    Salvar
                                </Button>

                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Deletar */}
                <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
                        <div className="h-2 w-full rounded-t-md bg-red-600" />

                        <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
                            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900">
                                <Trash className="h-10 w-10 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Confirmação</DialogTitle>
                        </DialogHeader>

                        <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
                            <p className="text-lg">
                                Deseja realmente excluir o comunicado <strong>{selectedComunicado?.title}</strong>?
                            </p>
                        </div>

                        <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex items-center gap-2"
                            >
                                Cancelar
                            </Button>

                            <Button
                                className="flex items-center gap-2 px-6 py-3 text-white bg-red-600 hover:bg-red-700"
                                onClick={async () => {
                                    await removeComunicado(selectedComunicado.id);
                                    setShowDeleteModal(false);
                                }}
                            >
                                Excluir
                            </Button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
