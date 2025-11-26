"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus, Bell, Eye, EyeOff, Clock, User, MessageSquare } from "lucide-react";
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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { PaginationDemo } from "@/components/pagination";

const CURRENT_USER_ID = 101;

export default function Mensagens() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");

    const [novoComunicado, setNovoComunicado] = useState({
        titulo: "",
        assunto: "",
        destinatario: "usuarios",
    });

    const [comunicados, setComunicados] = useState([
        {
            id: 1,
            titulo: "Manutenção no Sistema",
            assunto: "O sistema ficará fora do ar das 02h às 03h para manutenção preventiva.",
            destinatario: "usuarios",
            status: "nao_lido",
            autorId: 101,
            autorNome: "Síndico A",
            dataCricao: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 2,
            titulo: "Reunião Geral",
            assunto: "Reunião obrigatória para administradores nesta sexta. Revisar orçamento.",
            destinatario: "administradores",
            status: "lido",
            autorId: 102,
            autorNome: "Administradora B",
            dataCricao: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 3,
            titulo: "Troca de Lâmpadas",
            assunto: "Comunicado sobre a substituição de lâmpadas do hall de entrada.",
            destinatario: "usuarios",
            status: "nao_lido",
            autorId: 101,
            autorNome: "Síndico A",
            dataCricao: new Date(Date.now() - 7200000).toISOString(),
        },
    ]);

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

    const comunicadosFiltrados = comunicados.filter((c) => {
        if (filtro === "lidos") return c.status === "lido";
        if (filtro === "nao_lidos") return c.status === "nao_lido";
        if (filtro === "administradores") return c.destinatario === "administradores";
        if (filtro === "usuarios") return c.destinatario === "usuarios";
        if (filtro === "meus") return c.autorId === CURRENT_USER_ID;
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

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    <MessageSquare className="inline-block w-8 h-8 mr-2 text-primary" />
                    Central de Mensagens
                </h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2">
                            <Plus size={18} /> Criar Mensagem
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Mensagem</DialogTitle>
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
                    <TabsTrigger value="nao_lidos">Não Lidos</TabsTrigger>
                    <TabsTrigger value="lidos">Lidos</TabsTrigger>
                    <TabsTrigger value="meus">Enviados por Mim</TabsTrigger>
                    <TabsTrigger value="administradores">Para Administradores</TabsTrigger>
                    <TabsTrigger value="usuarios">Para Usuários</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Mensagens Recentes</CardTitle>
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
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${isLido ? 'bg-green-500/10' : 'bg-sky-500/10'}`}>
                                        {isLido ? (
                                            <Eye className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Bell className="w-5 h-5 text-sky-600" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className={`font-bold truncate ${!isLido ? 'text-foreground' : 'text-muted-foreground'}`}>{c.titulo}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{c.assunto}</p>

                                        <div className="flex flex-wrap items-center text-xs text-muted-foreground/80 pt-1 gap-x-4 gap-y-1">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                Enviado por: <span className="font-semibold text-foreground/70">{c.autorNome}</span>
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

                                    <div className="flex gap-2 ml-auto flex-shrink-0">
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className={isLido ? "text-green-600 hover:text-green-700" : "text-sky-600 hover:text-sky-700"}>
                                                    {isLido ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmação de Status</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {isLido ? `Tem certeza que deseja marcar a mensagem "${c.titulo}" como NÃO LIDA?` : `Tem certeza que deseja marcar a mensagem "${c.titulo}" como VISUALIZADA?`}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => isLido ? handleMarcarNaoLido(c.id) : handleMarcarLido(c.id)}>
                                                        {isLido ? "Marcar como Não Lido" : "Marcar como Visualizada"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>


                                        {isCriador && (
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {isCriador && (
                                            <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-500/10">
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