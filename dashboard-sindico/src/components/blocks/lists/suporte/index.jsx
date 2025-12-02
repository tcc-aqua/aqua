"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus, Bell, Eye, EyeOff, Clock, User, MessageSquare, Loader2, Mailbox, Send } from "lucide-react";
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

// IMPORTANTE: Assumindo que você tem uma função fetch autenticada (ex: api)
import { api } from "@/lib/api"; 

// Este ID deve ser obtido do contexto do usuário logado (geralmente via hook ou estado global)
// Por enquanto, usaremos um placeholder. O Service usa o ID do usuário logado (remetente_id).
const CURRENT_USER_ID = "e0420793-fe3a-4941-82d6-c454f5a2ccaa"; // Exemplo do ID do síndico que estava funcionando

export default function Mensagens() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [mensagens, setMensagens] = useState([]); // Agora armazena as mensagens de Suporte
    
    // Placeholder para o modal de nova mensagem (ajustar para enviar para destinatario_id)
    const [novaMensagem, setNovaMensagem] = useState({
        assunto: "",
        mensagem: "",
        destinatario_id: "", // ID do destinatário específico
    });
    
    // --- FUNÇÃO DE FETCH ---
    const fetchMensagens = useCallback(async (page = 1, statusFiltro = "todos") => {
        setIsLoading(true);
        try {
            // Constrói os parâmetros de busca
            let url = `/suporte?page=${page}&limit=10`;

            // Adicionar filtros de status aqui
            if (statusFiltro !== "todos" && statusFiltro !== "meus") {
                 // Adapte esta lógica de filtro se seu backend suportar filtros por query string
                // Ex: url += `&status=${statusFiltro}`; 
            }

            const response = await api.get(url); 
            
            // O backend retorna { docs: [...], pages: N, total: M }
            setMensagens(response.docs || []);
            setTotalPages(response.pages || 1);
            setCurrentPage(page);

        } catch (error) {
            console.error("Erro ao buscar mensagens de suporte:", error);
            // Poderia adicionar uma notificação de erro aqui
            setMensagens([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Busca os dados na montagem do componente
        fetchMensagens(1, filtro);
    }, [fetchMensagens, filtro]); // Refaz a busca ao mudar o filtro (se o filtro for tratado pelo Service/URL)

    // --- Lógica de Filtro Front-end (Adaptada) ---
    // NOTA: Para grandes volumes, é melhor filtrar no Service (Backend).
    // Aqui, aplicamos os filtros que não foram passados ao Service.
    const mensagensFiltradas = mensagens.filter((m) => {
        if (filtro === "lidos") return m.status === "respondido"; // Mapeando lido para 'respondido'
        if (filtro === "nao_lidos") return m.status === "pendente"; // Mapeando não lido para 'pendente'
        if (filtro === "meus") return m.remetente_id === CURRENT_USER_ID; // Mensagens que eu enviei
        
        // Os filtros 'usuarios'/'administradores' são complexos aqui sem o relacionamento completo.
        // Iremos ignorar o filtro de destinatário por enquanto.
        return true;
    });

    // --- Funções de Ação (Placeholder) ---
    const handleMarcarRespondido = async (id) => {
        try {
            // Exemplo de chamada para o endpoint de resposta
            const respostaDummy = "O síndico marcou como respondida por leitura no sistema.";
            await api.put(`/suporte/${id}/responder`, { resposta: respostaDummy });
            // Recarrega a lista após a ação
            fetchMensagens(currentPage, filtro); 
        } catch (error) {
             console.error("Erro ao marcar como respondido:", error);
        }
    };
    
    // Não implementaremos 'Marcar como Não Lido' no status 'respondido'/'pendente' padrão.

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

    // Função de renderização para o nome do autor
    const renderNomeUsuario = (usuarioObj, defaultText = "N/A") => {
        if (usuarioObj && usuarioObj.name) {
            return `${usuarioObj.name} (${usuarioObj.residencia_type === 'apartamento' ? 'Ap.' : 'Casa'})`;
        }
        return defaultText;
    };
    
    // Renderiza o componente
    return (
        <div className="container mx-auto mt-6 space-y-6">

            <div className="flex justify-between items-center">
                {/* O Modal de Criação de Mensagem precisaria ser refeito para buscar destinatários válidos */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2">
                            <Plus size={18} /> Criar Mensagem
                        </Button>
                    </DialogTrigger>
                    {/* ... (Conteúdo do Dialog omitido para foco no fetch) */}
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Mensagem</DialogTitle>
                            <DialogDescription>
                                Envie uma mensagem de suporte para um destinatário específico.
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
                                <p className="text-xs text-muted-foreground">Em produção, seria um Select com busca.</p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => console.log('Simulação de Envio de Mensagem')}>Enviar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={filtro} onValueChange={setFiltro}>
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
                                // Mapeamento do status e autor
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
                                            {/* Botão de Marcar como Respondido / Responder */}
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
                                                                Você pode registrar a resposta aqui ou usar este botão para marcar como respondida.
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

                                            {/* Botão de Editar (Apenas para o criador e se não foi respondido) */}
                                            {isEnviadoPorMim && !isRespondido && (
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                                                    <Pencil size={16} />
                                                </Button>
                                            )}
                                            {/* Botão de Deletar (Se for o criador) */}
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
                        onPageChange={(page) => fetchMensagens(page, filtro)}
                    />
                </Card>
            </div>

        </div>
    );
}