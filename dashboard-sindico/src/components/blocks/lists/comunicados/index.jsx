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
import { Pencil, Trash, Plus, Bell, BellOff, Clock, Shield, Eye, EyeOff, User } from "lucide-react"; // Adicionado Eye e User
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, // Adicionado
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Adicionado

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
import { PaginationDemo } from "@/components/pagination";

// --- SIMULAÇÃO DE DADOS ---
const CURRENT_USER_ID = 101; // ID do usuário logado (Síndico A)

export default function ComunicadosDashboard() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");

    const [novoComunicado, setNovoComunicado] = useState({
        titulo: "",
        assunto: "",
        destinatario: "usuarios",
    });

    // Dados de comunicado estendidos
    const [comunicados, setComunicados] = useState([
        {
            id: 1,
            titulo: "Manutenção no Sistema",
            assunto: "O sistema ficará fora do ar das 02h às 03h para manutenção preventiva.",
            destinatario: "usuarios",
            status: "nao_lido",
            autorId: 101, // Criado pelo usuário logado
            autorNome: "Síndico A",
            dataCricao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        },
        {
            id: 2,
            titulo: "Reunião Geral",
            assunto: "Reunião obrigatória para administradores nesta sexta. Revisar orçamento.",
            destinatario: "administradores",
            status: "lido",
            autorId: 102, // Criado por outro usuário/sistema
            autorNome: "Administradora B",
            dataCricao: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        },
        {
            id: 3,
            titulo: "Troca de Lâmpadas",
            assunto: "Comunicado sobre a substituição de lâmpadas do hall de entrada.",
            destinatario: "usuarios",
            status: "nao_lido",
            autorId: 101, // Criado pelo usuário logado
            autorNome: "Síndico A",
            dataCricao: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        },
    ]);

    // Lógica para marcar como lido (simulação)
    const handleMarcarLido = (id) => {
        setComunicados(prev =>
            prev.map(c =>
                c.id === id ? { ...c, status: "lido" } : c
            )
        );
    };

    const handleMarcarNaoLido = (id) => {
        setComunicados(prev =>
            prev.map(c =>
                c.id === id ? { ...c, status: "nao_lido" } : c
            )
        );
    };


    const total = comunicados.length;
    const naoLidos = comunicados.filter(c => c.status === "nao_lido").length;
    const paraUsuarios = comunicados.filter(c => c.destinatario === "usuarios").length;
    const paraAdmins = comunicados.filter(c => c.destinatario === "administradores").length;
    const meusComunicados = comunicados.filter(c => c.autorId === CURRENT_USER_ID).length; // Novo card

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
            title: "Meus Comunicados", // Novo Card
            value: meusComunicados,
            icon: User,
            iconColor: "text-primary",
            subTitle2: "Criados por mim",
        },
        {
            title: "Para mim",
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
        if (filtro === "meus") return c.autorId === CURRENT_USER_ID; // Novo filtro
        return true;
    });

    const formatarData = (dataString) => {
        if (!dataString) return "-";
        return new Date(dataString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="container mx-auto mt-6 space-y-6">

            {/* --- Seção de Cards KPI (Melhorado) --- */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {cardsData.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <AnimationWrapper key={card.title} delay={i * 0.1}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-2">
                                    <CardTitle className="font-semibold text-lg text-foreground/80">
                                        {card.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex flex-row items-center justify-between -mt-1">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-3xl text-foreground">{card.value}</p>

                                        {/* Exibindo sub-títulos */}
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
                                            <p className="text-primary text-sm mt-1">{card.subTitle2}</p>
                                        )}
                                    </div>

                                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    );
                })}
            </section>

            {/* --- Botão Criar --- */}
            <div className="flex justify-between items-center">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2">
                            <Plus size={18} /> Criar Comunicado
                        </Button>
                    </DialogTrigger>
                    {/* ... (DialogContent permanece o mesmo) ... */}
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

            {/* --- Abas de Filtro --- */}
            <Tabs value={filtro} onValueChange={setFiltro}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="nao_lidos">Não Lidos</TabsTrigger>
                    <TabsTrigger value="lidos">Lidos</TabsTrigger>
                    <TabsTrigger value="meus">Meus Comunicados</TabsTrigger>
                    <TabsTrigger value="usuarios">Para Síndicos</TabsTrigger>
                    <TabsTrigger value="usuarios">Para Mim</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* --- Lista de Comunicados --- */}
            <div className="space-y-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Lista de Comunicados</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y p-0">
                        {comunicadosFiltrados.map((c) => {
                            const isCriador = c.autorId === CURRENT_USER_ID;
                            const isLido = c.status === "lido";

                            return (
                                <div
                                    key={c.id}
                                    className={`flex items-start py-4 px-6 gap-4 transition-colors ${!isLido ? 'bg-secondary/10 hover:bg-secondary/20' : 'hover:bg-muted/50'}`}
                                >
                                    {/* Ícone Indicador de Status */}
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${isLido ? 'bg-green-500/10' : 'bg-sky-500/10'}`}>
                                        {isLido ? (
                                            <Eye className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Bell className="w-5 h-5 text-sky-600" />
                                        )}
                                    </div>

                                    {/* Conteúdo do Comunicado (Melhorado) */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className={`font-bold truncate ${!isLido ? 'text-foreground' : 'text-muted-foreground'}`}>{c.titulo}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{c.assunto}</p>
                                        
                                        {/* NOVAS INFORMAÇÕES */}
                                        <div className="flex items-center text-xs text-muted-foreground/80 pt-1 gap-4">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                Criado por: <span className="font-semibold text-foreground/70">{c.autorNome}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                Destino: <span className="font-semibold text-foreground/70">
                                                    {c.destinatario === "administradores" ? "Administradores" : "Usuários"}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                Data: <span className="font-semibold text-foreground/70">{formatarData(c.dataCricao)}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ações (Olho, Editar, Deletar) */}
                                    <div className="flex gap-2 ml-auto flex-shrink-0">
                                        
                                        {/* Ação: Marcar como Visualizado/Não Visualizado */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className={isLido ? "text-green-600 hover:bg-green-100" : "text-sky-600 hover:bg-sky-100"}>
                                                    {isLido ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmação de Leitura</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {isLido ? `Tem certeza que deseja marcar o comunicado "${c.titulo}" como NÃO LIDO?` : `Tem certeza que deseja marcar o comunicado "${c.titulo}" como VISUALIZADO?`}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => isLido ? handleMarcarNaoLido(c.id) : handleMarcarLido(c.id)}>
                                                        {isLido ? "Marcar como Não Lido" : "Marcar como Visualizado"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>


                                        {/* Ação: Editar (Apenas se for o criador) */}
                                        {isCriador && (
                                            <Button size="icon" variant="ghost">
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {/* Ação: Deletar (Apenas se for o criador) */}
                                        {isCriador && (
                                            <Button size="icon" variant="ghost" className="text-red-600">
                                                <Trash size={16} />
                                            </Button>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                    <PaginationDemo />
                </Card>
            </div>

        </div>
    );
}