"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Pencil,
    Trash,
    Plus,
    Bell,
    Clock,
    User,
    Loader2,
    Mail,
    MailOpen,
} from "lucide-react";
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

export default function ComunicadosDashboard() {
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    const [comunicados, setComunicados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [totalComunicados, setTotalComunicados] = useState(0);
    const [myTotalComunicados, setMyTotalComunicados] = useState(0);
    const [totalAdminParaSindicos, setTotalAdminParaSindicos] = useState(0);
    const [totalRecebidos, setTotalRecebidos] = useState(0);

    const [novoComunicado, setNovoComunicado] = useState({
        title: "",
        subject: "",
        addressee: "usuários",
    });

    const [comunicadoEdit, setComunicadoEdit] = useState({
        id: null,
        title: "",
        subject: "",
        addressee: "usuários",
    });

    // Carrega perfil do usuário logado
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    setProfile(await res.json());
                }
            } catch (err) {
                console.error("Erro ao buscar perfil:", err);
            }
        };

        fetchProfile();
    }, []);

    const loadTotalComunicados = useCallback(async () => {
        try {
            const { total } = await api.get("/comunicados/total");
            if (typeof total === "number") setTotalComunicados(total);
        } catch (err) {
            console.error("Erro ao carregar total de comunicados:", err);
        }
    }, []);

    const loadMyTotalComunicados = useCallback(async () => {
        if (!profile) return;
        try {
            const { total } = await api.get("/comunicados/me");
            if (typeof total === "number") setMyTotalComunicados(total);
        } catch (err) {
            console.error("Erro ao carregar meus comunicados:", err);
        }
    }, [profile]);

    const loadTotalAdminParaSindicos = useCallback(async () => {
        try {
            const { total } = await api.get("/comunicados/admin-para-sindicos-count");
            if (typeof total === "number") setTotalAdminParaSindicos(total);
        } catch (err) {
            console.error("Erro ao carregar comunicados Admin -> Síndicos:", err);
        }
    }, []);

    const loadTotalRecebidos = useCallback(async () => {
        try {
            const { total_recebidos } = await api.get("/comunicados/recebidos-count");
            if (typeof total_recebidos === "number") setTotalRecebidos(total_recebidos);
        } catch (err) {
            console.error("Erro ao carregar comunicados recebidos:", err);
        }
    }, []);

    const loadComunicados = useCallback(async () => {
        if (!profile) return;
        setIsLoading(true);
        try {
            const { docs } = await api.get("/comunicados");
            if (docs) {
                const mappedComunicados = docs.map((c) => ({
                    id: c.id,
                    titulo: c.title,
                    assunto: c.subject,
                    destinatario: c.addressee,
                    autorId: c.sindico_id,
                    autorNome:
                        c.sindico_id === profile.id
                            ? `${profile.name} (Você)`
                            : c.sindico_nome || "Administração",
                    dataCricao: c.criado_em,
                }));
                setComunicados(mappedComunicados);
            } else {
                setComunicados([]);
            }
        } catch (err) {
            console.error("Erro ao carregar comunicados:", err);
            toast.error(err.message || "Falha ao carregar comunicados.");
        } finally {
            setIsLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        if (profile) {
            loadComunicados();
            loadTotalComunicados();
            loadMyTotalComunicados();
            loadTotalAdminParaSindicos();
            loadTotalRecebidos();
        }
    }, [
        profile,
        loadComunicados,
        loadTotalComunicados,
        loadMyTotalComunicados,
        loadTotalAdminParaSindicos,
        loadTotalRecebidos,
    ]);

    // Criar comunicado
    const handleCriarComunicado = async () => {
        if (!novoComunicado.title || !novoComunicado.subject) {
            toast.warning("Preencha o título e o assunto.");
            return;
        }

        const toastId = toast.loading("Criando comunicado...");
        try {
            const response = await api.post("/comunicados", novoComunicado);
            if (response && response.id) {
                await loadComunicados();
                await loadTotalComunicados();
                await loadMyTotalComunicados();
                await loadTotalRecebidos();
                setNovoComunicado({ title: "", subject: "", addressee: "usuários" });
                setOpen(false);
                toast.success("Comunicado criado e enviado com sucesso!");
            } else {
                throw new Error(response.message || "Resposta da API inválida ao criar.");
            }
        } catch (err) {
            toast.error(err.message || "Falha ao criar comunicado.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    // Editar comunicado
    const handleEditComunicado = async () => {
        if (!comunicadoEdit.title || !comunicadoEdit.subject) {
            toast.warning("Preencha o título e o assunto.");
            return;
        }
        const toastId = toast.loading("Atualizando comunicado...");
        try {
            const response = await api.put(`/comunicados/${comunicadoEdit.id}`, {
                title: comunicadoEdit.title,
                subject: comunicadoEdit.subject,
                addressee: comunicadoEdit.addressee,
            });
            await loadComunicados();
            setOpenEdit(false);
            toast.success("Comunicado atualizado com sucesso!");
        } catch (err) {
            toast.error(err.message || "Falha ao atualizar comunicado.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    // Deletar comunicado
    const handleDeletar = async (id, titulo) => {
        const toastId = toast.loading(`Deletando comunicado "${titulo}"...`);
        try {
            const response = await api.del(`/comunicados/${id}`);
            if (response && !response.error) {
                setComunicados((prev) => prev.filter((c) => c.id !== id));
                await loadComunicados();
                await loadTotalComunicados();
                await loadMyTotalComunicados();
                await loadTotalRecebidos();
                toast.success(`Comunicado "${titulo}" deletado!`);
            } else {
                throw new Error(response.message || "Falha ao deletar comunicado.");
            }
        } catch (err) {
            toast.error(err.message || "Falha ao deletar comunicado.");
        } finally {
            toast.dismiss(toastId);
        }
    };

    const cardsData = [
        { title: "Total de Comunicados", value: totalComunicados, icon: Bell, iconColor: "text-blue-500", porcentagem: "Visão Geral" },
        { title: "Meus Comunicados", value: myTotalComunicados, icon: User, iconColor: "text-primary", subTitle2: "Criados por mim" },
        { title: "Recebidos", value: totalRecebidos, icon: MailOpen, iconColor: "text-green-600", subTitle2: "Enviados por outros" },
        { title: "Admin -> Síndicos", value: totalAdminParaSindicos, icon: Mail, iconColor: "text-purple-500", subTitle: "Comunicados Globais" },
    ];

    const comunicadosFiltrados = comunicados.filter((c) => {
        if (filtro === "administradores") return c.destinatario === "administradores";
        if (filtro === "usuários" || filtro === "sindicos") return c.destinatario === filtro;
        if (filtro === "meus" && profile) return c.autorId === profile.id;
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
            case "usuários": return "Usuários";
            case "administradores": return "Administradores";
            case "sindicos": return "Síndicos";
            default: return "Geral";
        }
    };

    return (
        <div className="container mx-auto mt-6 space-y-6">
            {/* Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {cardsData.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <AnimationWrapper key={card.title} delay={i * 0.1}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-2">
                                    <CardTitle className="font-semibold text-lg text-foreground/80">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row items-center justify-between -mt-1">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-3xl text-foreground">{card.value}</p>
                                        {card.porcentagem && <p className="text-blue-500 text-sm mt-1">{card.porcentagem}</p>}
                                        {card.subTitle && <p className="text-purple-500 text-sm mt-1">{card.subTitle}</p>}
                                        {card.subTitle2 && <p className={`${card.title === "Recebidos" ? "text-green-600" : "text-primary"} text-sm mt-1`}>{card.subTitle2}</p>}
                                    </div>
                                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    );
                })}
            </section>

            {/* Criar Comunicado */}
            <div className="flex justify-between items-center">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex gap-2"><Plus size={18} /> Criar Comunicado</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Comunicado</DialogTitle>
                            <DialogDescription>Preencha as informações para criar um novo comunicado.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Input placeholder="Título" value={novoComunicado.title} onChange={(e) => setNovoComunicado({ ...novoComunicado, title: e.target.value })} />
                            <Textarea placeholder="Assunto" value={novoComunicado.subject} onChange={(e) => setNovoComunicado({ ...novoComunicado, subject: e.target.value })} />
                            <Select value={novoComunicado.addressee} onValueChange={(v) => setNovoComunicado({ ...novoComunicado, addressee: v })}>
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usuários">Usuários do Condomínio</SelectItem>
                                    <SelectItem value="administradores">Administradores</SelectItem>
                                    <SelectItem value="sindicos" disabled>Síndicos (Global)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter><Button onClick={handleCriarComunicado}>Salvar e Enviar</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tabs */}
            <Tabs value={filtro} onValueChange={setFiltro}>
                <TabsList className="flex flex-wrap">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="meus">Meus Comunicados</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Lista de Comunicados */}
            <div className="space-y-4">
                <Card className="shadow-lg">
                    <CardHeader><CardTitle className="text-lg font-bold">Lista de Comunicados</CardTitle></CardHeader>
                    {isLoading ? (
                        <div className="p-8 flex justify-center items-center text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Carregando comunicados...
                        </div>
                    ) : comunicadosFiltrados.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhum comunicado encontrado.</div>
                    ) : (
                        <CardContent className="divide-y p-0">
                            {comunicadosFiltrados.map((c) => {
                                const isCriador = profile && c.autorId === profile.id;
                                return (
                                    <div key={c.id} className="flex items-start py-4 px-6 gap-4 transition-colors hover:bg-muted/50">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 bg-sky-500/10">
                                            <Bell className="w-5 h-5 text-sky-600" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className="font-bold truncate text-foreground">{c.titulo}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{c.assunto}</p>
                                            <div className="flex items-center text-xs text-muted-foreground/80 pt-1 gap-4">
                                                <span className="flex items-center gap-1"><User size={12} /> Criado por: <span className="font-semibold text-foreground/70">{c.autorNome}</span></span>
                                                <span className="flex items-center gap-1"><User size={12} /> Destino: <span className="font-semibold text-foreground/70">{getDestinatarioLabel(c.destinatario)}</span></span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> Data: <span className="font-semibold text-foreground/70">{formatarData(c.dataCricao)}</span></span>
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="flex gap-2 ml-auto flex-shrink-0">
                                            {isCriador && (
                                                <>
                                                    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                                                        <DialogTrigger asChild>
                                                            <Button size="icon" variant="ghost" onClick={() => setComunicadoEdit({ id: c.id, title: c.titulo, subject: c.assunto, addressee: c.destinatario })}>
                                                                <Pencil size={16} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Editar Comunicado</DialogTitle>
                                                                <DialogDescription>Atualize as informações do comunicado.</DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 mt-4">
                                                                <Input placeholder="Título" value={comunicadoEdit.title} onChange={(e) => setComunicadoEdit({ ...comunicadoEdit, title: e.target.value })} />
                                                                <Textarea placeholder="Assunto" value={comunicadoEdit.subject} onChange={(e) => setComunicadoEdit({ ...comunicadoEdit, subject: e.target.value })} />
                                                                <Select value={comunicadoEdit.addressee} onValueChange={(v) => setComunicadoEdit({ ...comunicadoEdit, addressee: v })}>
                                                                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="usuários">Usuários do Condomínio</SelectItem>
                                                                        <SelectItem value="administradores">Administradores</SelectItem>
                                                                        <SelectItem value="sindicos" disabled>Síndicos (Global)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button onClick={handleEditComunicado}>Salvar Alterações</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

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
                                                                    Tem certeza que deseja excluir permanentemente o comunicado: <strong>{c.titulo}</strong>?
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
