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
import { Pencil, Trash, Plus, Bell, Clock, User, Loader2, Mail } from "lucide-react";
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
import { api } from "@/lib/api";
import { toast } from "sonner";

import AnimationWrapper from "../../../layout/Animation/Animation";
import { PaginationDemo } from "@/components/pagination";

const CURRENT_USER_ID = "e0420793-fe3a-4941-82d6-c454f5a2ccaa"; // ID DE SÍNDICO DE EXEMPLO

export default function ComunicadosDashboard() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    const [comunicados, setComunicados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [totalComunicados, setTotalComunicados] = useState(0);
    const [myTotalComunicados, setMyTotalComunicados] = useState(0);
    const [totalAdminParaSindicos, setTotalAdminParaSindicos] = useState(0); 

    const [novoComunicado, setNovoComunicado] = useState({
        title: "",
        subject: "",
        addressee: "usuários",
    });

    const loadTotalComunicados = useCallback(async () => {
        try {
            const { total } = await api.get('/comunicados/total');
            if (typeof total === 'number') {
                setTotalComunicados(total);
            }
        } catch (error) {
            console.error("Erro ao carregar o total de comunicados visíveis:", error);
        }
    }, []);

    const loadMyTotalComunicados = useCallback(async () => {
        try {
            const { total } = await api.get('/comunicados/me');
            if (typeof total === 'number') {
                setMyTotalComunicados(total);
            }
        } catch (error) {
            console.error("Erro ao carregar o total dos meus comunicados:", error);
        }
    }, []);

    const loadTotalAdminParaSindicos = useCallback(async () => {
        try {
            const { total } = await api.get('/comunicados/admin-para-sindicos-count'); 
            if (typeof total === 'number') {
                setTotalAdminParaSindicos(total);
            }
        } catch (error) {
            console.error("Erro ao carregar o total de comunicados Admin -> Síndicos:", error);
        }
    }, []);


    const loadComunicados = useCallback(async () => {
        setIsLoading(true);
        const endpoint = '/comunicados';

        try {
            const { docs } = await api.get(endpoint);

            if (docs) {
                const mappedComunicados = docs.map(c => ({
                    id: c.id,
                    titulo: c.title,
                    assunto: c.subject,
                    destinatario: c.addressee,
                    autorId: c.sindico_id,
                    autorNome: c.sindico_id === CURRENT_USER_ID ? "Síndico (Você)" : "Administração",
                    dataCricao: c.criado_em,
                    // REMOÇÃO DA PROPRIEDADE 'status' RELACIONADA À LEITURA
                }));

                setComunicados(mappedComunicados);
            } else {
                setComunicados([]);
            }
        } catch (error) {
            console.error("Erro ao carregar comunicados:", error);
            toast.error(error.message || "Falha ao carregar comunicados.");
            setComunicados([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComunicados();
        loadTotalComunicados();
        loadMyTotalComunicados();
        // REMOÇÃO DE loadTotalNaoLidos
        loadTotalAdminParaSindicos();
    }, [loadComunicados, loadTotalComunicados, loadMyTotalComunicados, loadTotalAdminParaSindicos]);


    // --- FUNÇÕES DE AÇÃO (CRUD) ---

    const handleCriarComunicado = async () => {
        if (!novoComunicado.title || !novoComunicado.subject) {
            toast.warning("Preencha o título e o assunto.");
            return;
        }

        const comunicadoParaCriar = {
            title: novoComunicado.title,
            subject: novoComunicado.subject,
            addressee: novoComunicado.addressee,
        };
        
        const toastId = toast.loading("Criando comunicado...");

        try {
            const response = await api.post('/comunicados', comunicadoParaCriar);

            if (response && response.id) {
                await loadComunicados();
                await loadTotalComunicados();
                await loadMyTotalComunicados();
                setNovoComunicado({ title: "", subject: "", addressee: "usuários" });
                setOpen(false);
                toast.success("Comunicado criado e enviado com sucesso!");
            } else {
                throw new Error(response.message || "Resposta da API inválida ao criar.");
            }
        } catch (error) {
            toast.error(error.message || "Falha ao criar comunicado.");
        } finally {
            toast.dismiss(toastId);
        }
    };
    
    // REMOÇÃO DE handleUpdateLidoStatus, handleMarcarLido E handleMarcarNaoLido

    const handleDeletar = async (id, titulo) => {
        const toastId = toast.loading(`Deletando comunicado "${titulo}"...`);

        try {
            const response = await api.del(`/comunicados/${id}`);

            if (response && !response.error) {
                setComunicados(prev => prev.filter(c => c.id !== id));
                await loadComunicados();
                await loadTotalComunicados();
                await loadMyTotalComunicados();
                // REMOÇÃO DE loadTotalNaoLidos
                toast.success(`Comunicado "${titulo}" deletado!`);
            } else {
                throw new Error(response.message || "Falha na resposta da API ao deletar.");
            }
        } catch (error) {
            toast.error(error.message || "Falha ao deletar comunicado.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    // --- DADOS E FILTROS DE VISUALIZAÇÃO ---

    const cardsData = [
        {
            title: "Total de Comunicados",
            value: totalComunicados,
            icon: Bell,
            iconColor: "text-blue-500",
            porcentagem: "Visão Geral",
        },
        // REMOÇÃO DO CARD "NÃO LIDOS"
        {
            title: "Meus Comunicados",
            value: myTotalComunicados,
            icon: User,
            iconColor: "text-primary",
            subTitle2: "Criados por mim",
        },
        {
            title: "Admin -> Síndicos",
            value: totalAdminParaSindicos, 
            icon: Mail,
            iconColor: "text-purple-500",
            subTitle: "Comunicados Globais",
        },
    ];

    const comunicadosFiltrados = comunicados.filter((c) => {
        // REMOÇÃO DOS FILTROS "lidos" e "nao_lidos"
        if (filtro === "administradores") return c.destinatario === "administradores";
        if (filtro === "usuários" || filtro === "sindicos") return c.destinatario === filtro;
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

    const getDestinatarioLabel = (destinatario) => {
        switch (destinatario) {
            case 'usuários':
                return 'Usuários';
            case 'administradores':
                return 'Administradores';
            case 'sindicos':
                return 'Síndicos';
            default:
                return 'Geral';
        }
    };

    return (
        <div className="container mx-auto mt-6 space-y-6">

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

            <div className="flex justify-between items-center">
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
                                    value={novoComunicado.title}
                                    onChange={(e) =>
                                        setNovoComunicado({ ...novoComunicado, title: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto</label>
                                <Textarea
                                    placeholder="Digite o assunto..."
                                    value={novoComunicado.subject}
                                    onChange={(e) =>
                                        setNovoComunicado({ ...novoComunicado, subject: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Destinatário</label>
                                <Select
                                    value={novoComunicado.addressee}
                                    onValueChange={(v) =>
                                        setNovoComunicado({ ...novoComunicado, addressee: v })
                                    }
                                    disabled={false}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usuários">Usuários do Condomínio</SelectItem>
                                        <SelectItem value="administradores">Administradores</SelectItem>
                                        <SelectItem value="sindicos" disabled>Síndicos (Global)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Selecione o grupo que deve receber este comunicado.
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCriarComunicado}>Salvar e Enviar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={filtro} onValueChange={setFiltro}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    {/* REMOÇÃO DOS FILTROS LIDOS/NÃO LIDOS */}
                    <TabsTrigger value="meus">Meus Comunicados</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Lista de Comunicados</CardTitle>
                    </CardHeader>
                    {isLoading ? (
                        <div className="p-8 flex justify-center items-center text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Carregando comunicados...
                        </div>
                    ) : comunicadosFiltrados.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Nenhum comunicado encontrado com o filtro atual.
                        </div>
                    ) : (
                        <CardContent className="divide-y p-0">
                            {comunicadosFiltrados.map((c) => {
                                const isCriador = c.autorId === CURRENT_USER_ID;
                                
                                return (
                                    <div
                                        key={c.id}
                                        className={`flex items-start py-4 px-6 gap-4 transition-colors hover:bg-muted/50`}
                                    >
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 bg-sky-500/10`}>
                                            <Bell className="w-5 h-5 text-sky-600" />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className={`font-bold truncate text-foreground`}>{c.titulo}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{c.assunto}</p>

                                            <div className="flex items-center text-xs text-muted-foreground/80 pt-1 gap-4">
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    Criado por: <span className="font-semibold text-foreground/70">{c.autorNome}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    Destino: <span className="font-semibold text-foreground/70">
                                                        {getDestinatarioLabel(c.destinatario)}
                                                    </span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    Data: <span className="font-semibold text-foreground/70">{formatarData(c.dataCricao)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-auto flex-shrink-0">

                                            {/* REMOÇÃO DO BOTÃO DE MARCAR LIDO/NÃO LIDO */}

                                            {/* BOTÕES DE EDIÇÃO E EXCLUSÃO (Apenas para o criador) */}
                                            {isCriador && (
                                                <>
                                                    <Button size="icon" variant="ghost">
                                                        <Pencil size={16} />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-100">
                                                                <Trash size={16} />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir permanentemente o comunicado: **{c.titulo}**?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                    onClick={() => handleDeletar(c.id, c.titulo)}
                                                                >
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    )}

                    <PaginationDemo />
                </Card>
            </div>

        </div>
    );
}