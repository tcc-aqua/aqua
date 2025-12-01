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
import { Pencil, Trash, Plus, Bell, BellOff, Clock, Shield, Eye, EyeOff, User, Loader2 } from "lucide-react";
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

// ⚠️ SUBSTITUA ISTO: Este ID deve ser obtido do token do usuário logado (ex: via useAuth)
// Usamos '1' temporariamente, mas deve ser real.
const CURRENT_USER_ID = 1; 

export default function ComunicadosDashboard() {
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    // O estado deve refletir a estrutura de dados da API
    const [comunicados, setComunicados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [novoComunicado, setNovoComunicado] = useState({
        title: "",
        subject: "",
        addressee: "usuários",
    });

    const loadComunicados = useCallback(async () => {
        setIsLoading(true);
        const endpoint = '/comunicados';
        
        try {
            const data = await api.get(endpoint);

            if (data && data.docs) {
                // ✅ MAPEAMENTO REALISTA: Usando os nomes das colunas da API (c.title, c.subject, c.sindico_id)
                const mappedComunicados = data.docs.map(c => ({
                    id: c.id,
                    titulo: c.title,
                    assunto: c.subject,
                    destinatario: c.addressee,
                    // Usando o ID real do sindico retornado pela API
                    autorId: c.sindico_id, 
                    // O nome do autor deve vir de um JOIN na API, 
                    // se não vier, simule baseado no ID do usuário atual para diferenciar
                    autorNome: c.sindico_id === CURRENT_USER_ID ? "Síndico (Você)" : "Administração", 
                    dataCricao: c.criado_em,
                    // A API deve retornar o status de leitura para o usuário atual. 
                    // Se não tiver, defina um padrão. Aqui mantemos 'nao_lido' se não definido.
                    status: c.status_leitura || "nao_lido", 
                }));

                setComunicados(mappedComunicados);
                toast.success(`Comunicados carregados com sucesso! Total: ${data.total}`);
            } else {
                toast.error("Nenhum comunicado encontrado ou formato de resposta da API inválido.");
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
    }, [loadComunicados]);

    const handleCriarComunicado = async () => {
        if (!novoComunicado.title || !novoComunicado.subject) {
            toast.warning("Preencha o título e o assunto.");
            return;
        }

        // Não enviamos o sindico_id. O backend Fastify (via token) fará isso.
        const comunicadoParaCriar = {
            title: novoComunicado.title,
            subject: novoComunicado.subject,
            addressee: novoComunicado.addressee, 
        };
        
        if (comunicadoParaCriar.addressee !== 'usuários') {
            toast.warning("Como síndico, você só pode criar comunicados para 'usuários'.");
            return;
        }

        const toastId = toast.loading("Criando comunicado...");

        try {
            const response = await api.post('/comunicados', comunicadoParaCriar);
            
            if (response && response.id) {
                await loadComunicados(); // Recarrega a lista para mostrar o novo item
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

    const handleUpdateStatus = async (id, novoStatus) => {
        const toastId = toast.loading(`Atualizando status para ${novoStatus}...`);

        try {
            // ✅ CHAMADA REAL: PUT para atualizar o status de leitura no backend
            const response = await api.put(`/comunicados/${id}/status`, { status: novoStatus });

            if (response && response.message) { // Assumindo que a API retorna um sucesso
                 setComunicados(prev =>
                    prev.map(c =>
                        c.id === id ? { ...c, status: novoStatus } : c
                    )
                );
                toast.success(`Comunicado marcado como ${novoStatus === 'lido' ? 'lido' : 'não lido'}!`);
            } else {
                throw new Error("Falha na resposta da API ao atualizar status.");
            }
        } catch (error) {
            toast.error(error.message || "Falha ao atualizar status.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    const handleMarcarLido = (id) => handleUpdateStatus(id, "lido");
    const handleMarcarNaoLido = (id) => handleUpdateStatus(id, "nao_lido");

    const handleDeletar = async (id, titulo) => {
        const toastId = toast.loading(`Deletando comunicado "${titulo}"...`);

        try {
            // ✅ CHAMADA REAL: DELETE para excluir o comunicado
            const response = await api.del(`/comunicados/${id}`); 

            // Assumindo que o DELETE bem sucedido retorna um objeto vazio ou de sucesso
            if (response && !response.error) {
                setComunicados(prev => prev.filter(c => c.id !== id));
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

    const total = comunicados.length;
    const naoLidos = comunicados.filter(c => c.status === "nao_lido").length;
    const paraAdmins = comunicados.filter(c => c.destinatario === "administradores").length;
    const meusComunicados = comunicados.filter(c => c.autorId === CURRENT_USER_ID).length;

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
            title: "Meus Comunicados",
            value: meusComunicados,
            icon: User,
            iconColor: "text-primary",
            subTitle2: "Criados por mim",
        },
        {
            title: "Para Mim (Síndico)",
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
                                    disabled={true} 
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usuários">Usuários (Padrão Condomínio)</SelectItem>
                                        <SelectItem value="sindicos" disabled>Síndicos</SelectItem>
                                        <SelectItem value="administradores" disabled>Administradores</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    *Como síndico, seu comunicado é direcionado automaticamente para os usuários do seu condomínio.
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
                    <TabsTrigger value="nao_lidos">Não Lidos ({naoLidos})</TabsTrigger>
                    <TabsTrigger value="lidos">Lidos</TabsTrigger>
                    <TabsTrigger value="meus">Meus Comunicados</TabsTrigger>
                    <TabsTrigger value="usuários">Para Usuários</TabsTrigger>
                    <TabsTrigger value="sindicos">Para Síndicos</TabsTrigger>
                    <TabsTrigger value="administradores">Para Administradores</TabsTrigger>
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
                                const isLido = c.status === "lido";

                                return (
                                    <div
                                        key={c.id}
                                        className={`flex items-start py-4 px-6 gap-4 transition-colors ${!isLido ? 'bg-secondary/10 hover:bg-secondary/20' : 'hover:bg-muted/50'}`}
                                    >
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${isLido ? 'bg-green-500/10' : 'bg-sky-500/10'}`}>
                                            {isLido ? (
                                                <EyeOff className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Bell className="w-5 h-5 text-sky-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className={`font-bold truncate ${!isLido ? 'text-foreground' : 'text-muted-foreground'}`}>{c.titulo}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{c.assunto}</p>
                                            
                                            <div className="flex items-center text-xs text-muted-foreground/80 pt-1 gap-4">
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    Criado por: <span className="font-semibold text-foreground/70">{c.autorNome}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={12} />
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


                                            {isCriador && (
                                                <Button size="icon" variant="ghost">
                                                    <Pencil size={16} />
                                                </Button>
                                            )}

                                            {isCriador && (
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