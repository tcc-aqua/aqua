"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus, Bell, EyeOff, Clock, User, MessageSquare, Loader2, Mailbox, Send } from "lucide-react";
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaginationDemo } from "@/components/pagination";

// --- FUNÇÃO DE FETCH CLIENT-SIDE ---
async function apiFetchClient(path, options = {}) {
    const getClientToken = () => {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        return match ? match[2] : null;
    };
    
    const token = getClientToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    const res = await fetch(url, {
        method: 'GET',
        ...options,
        headers,
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data?.message || `Erro na requisição para ${url}`);
    }

    return data;
}
// -----------------------------------------------------------------------------------------

// 🛑 ESTA CONSTANTE DEVE SER SUBSTITUÍDA PELA LÓGICA REAL DE OBTENÇÃO DO ID DO SÍNDICO LOGADO 🛑
const CURRENT_USER_ID = "f1b9a2d8-4c6e-4f7d-8e1c-5a3b2c1d0e9f"; 

export default function Mensagens() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mensagens, setMensagens] = useState([]); 

    const [novaMensagem, setNovaMensagem] = useState({
        assunto: "",
        mensagem: "",
        destinatario_id: "", 
    });
    
    const fetchMensagens = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const path = `/suporte?page=${page}&limit=10`;
            const response = await apiFetchClient(path); 
            
            setMensagens(response.docs || []);
            setTotalPages(response.pages || 1);
            setCurrentPage(page);

        } catch (error) {
            console.error("Erro ao buscar mensagens de suporte:", error);
            setMensagens([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMensagens(currentPage);
    }, [fetchMensagens, currentPage]); 

    const mensagensFiltradas = mensagens.filter((m) => {
        if (filtro === "nao_lidos") return m.status === "pendente";
        if (filtro === "lidos") return m.status === "respondido";
        if (filtro === "meus") return m.remetente_id === CURRENT_USER_ID;
        return true;
    });

    const handleMarcarRespondido = async (id) => {
        alert("Função de responder e marcar como respondido não implementada no cliente. ID: " + id);
    };

    const formatarData = (dataString) => {
        if (!dataString) return "-";
        return new Date(dataString).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
        });
    };

    const renderNomeUsuario = (usuarioObj, defaultText = "N/A") => {
        if (usuarioObj && usuarioObj.name) {
            return `${usuarioObj.name} (${usuarioObj.residencia_type === 'apartamento' ? 'Ap.' : 'Casa'})`;
        }
        return `ID: ${defaultText}`; 
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto mt-6 space-y-6">

            <div className="flex justify-between items-center">
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
                                Envie uma mensagem de suporte para um destinatário específico (Morador do seu condomínio).
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto</label>
                                <Input
                                    placeholder="Digite o assunto..."
                                    value={novaMensagem.assunto}
                                    onChange={(e) => setNovaMensagem({ ...novaMensagem, assunto: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Conteúdo</label>
                                <Textarea
                                    placeholder="Digite o conteúdo da mensagem..."
                                    value={novaMensagem.mensagem}
                                    onChange={(e) => setNovaMensagem({ ...novaMensagem, mensagem: e.target.value })}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destinatário (ID)</label>
                                <Input
                                    placeholder="Insira o ID do usuário destinatário..."
                                    value={novaMensagem.destinatario_id}
                                    onChange={(e) => setNovaMensagem({ ...novaMensagem, destinatario_id: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">O ID deve ser de um morador de apartamento do seu condomínio.</p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => alert("Simulação de Envio de Mensagem")}>Enviar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={filtro} onValueChange={(v) => { setFiltro(v); setCurrentPage(1); }}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="nao_lidos">Pendentes</TabsTrigger>
                    <TabsTrigger value="lidos">Respondidas</TabsTrigger>
                    <TabsTrigger value="meus">Enviadas por Mim</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Mensagens de Suporte</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y p-0">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-2 text-muted-foreground">Carregando mensagens...</span>
                            </div>
                        ) : mensagensFiltradas.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                Nenhuma mensagem encontrada com o filtro atual.
                            </div>
                        ) : (
                            mensagensFiltradas.map((m) => {
                                const isEnviadoPorMim = m.remetente_id === CURRENT_USER_ID;
                                const isRespondido = m.status === "respondido";
                                const IconeStatus = isRespondido ? EyeOff : Bell;

                                return (
                                    <div
                                        key={m.id}
                                        className={`flex items-start py-4 px-6 gap-4 transition-colors ${!isRespondido ? 'bg-secondary/10 hover:bg-secondary/20' : 'hover:bg-muted/50'}`}
                                    >
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${isRespondido ? 'bg-green-500/10' : 'bg-sky-500/10'}`}>
                                            <IconeStatus className={`w-5 h-5 ${isRespondido ? 'text-green-600' : 'text-sky-600'}`} />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className={`font-bold truncate ${!isRespondido ? 'text-foreground' : 'text-muted-foreground'}`}>{m.assunto}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{m.mensagem}</p>
                                            {m.resposta && (
                                                <blockquote className="border-l-4 border-gray-300 pl-3 text-sm italic text-gray-500 mt-2">
                                                    Resposta: {m.resposta.substring(0, 80)}...
                                                </blockquote>
                                            )}

                                            <div className="flex flex-wrap items-center text-xs text-muted-foreground/80 pt-1 gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1">
                                                    <Send size={12} />
                                                    De: <span className="font-semibold text-foreground/70">{renderNomeUsuario(m.Remetente, m.remetente_id)}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Mailbox size={12} />
                                                    Para: <span className="font-semibold text-foreground/70">{renderNomeUsuario(m.Destinatario, m.destinatario_id)}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    Data: <span className="font-semibold text-foreground/70">{formatarData(m.criado_em)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-auto flex-shrink-0">
                                            
                                            {!isRespondido && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="text-blue-600 hover:text-blue-700">
                                                            <MessageSquare size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Responder Mensagem</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Deseja apenas marcar esta mensagem como resolvida ou inserir uma resposta completa?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleMarcarRespondido(m.id)}>
                                                                Marcar como Respondida
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}

                                            {isEnviadoPorMim && !isRespondido && (
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                                                    <Pencil size={16} />
                                                </Button>
                                            )}
                                            {isEnviadoPorMim && (
                                                <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-500/10">
                                                    <Trash size={16} />
                                                </Button>
                                            )}

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                    <PaginationDemo 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange}
                    />
                </Card>
            </div>

        </div>
    );
}