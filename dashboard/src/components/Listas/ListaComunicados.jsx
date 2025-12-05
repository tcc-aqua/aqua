"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash, Plus, Bell, BellOff, Users, Shield, Edit, Check } from "lucide-react";
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
  const [showLidoModal, setShowLidoModal] = useState(false);
  const [comunicadoParaMarcar, setComunicadoParaMarcar] = useState(null);

  const [selectedComunicado, setSelectedComunicado] = useState(null);
  const [novoComunicado, setNovoComunicado] = useState({
    title: "",
    subject: "",
    addressee: "usuários",
  });

  const {
    comunicados,
    loading,
    error,
    addComunicado,
    editComunicado,
    removeComunicado,
    marcarComoLido,
    fetchComunicados,
  } = useComunicados();

  const comunicadosOrdenados = [...comunicados].sort(
    (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
  );

  const comunicadosFiltrados = comunicadosOrdenados.filter(
    (c) => filtro === "todos" || c.addressee === filtro
  );

  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  const comunicadoStats = {
    total: comunicados.length,
    lidos: comunicados.filter((c) => c.lido).length,
    naoLidos: comunicados.filter((c) => !c.lido).length,
    usuários: comunicados.filter((c) => c.addressee === "usuários").length,
    administradores: comunicados.filter((c) => c.addressee === "administradores").length,
    sindicos: comunicados.filter((c) => c.addressee === "sindicos").length,
  };

  const cardsData = [
    {
      title: "Comunicados",
      value: comunicadoStats.total,
      icon: Bell,
      iconColor: "text-accent",
      porcentagem: "Visão Geral",
      borderColor: "border-b-accent",
    },
    {
      title: "Não Lidos",
      value: comunicadoStats.naoLidos,
      icon: comunicadoStats.naoLidos > 0 ? BellOff : Check,
      iconColor: comunicadoStats.naoLidos > 0 ? "text-red-500" : "text-green-600",
      subTitle1:
        comunicadoStats.naoLidos > 0 ? `${comunicadoStats.naoLidos} pendentes` : "Nenhum pendente",
      borderColor: "border-b-red-500",
    },
    {
      title: "Para Usuários",
      value: comunicadoStats.usuários,
      icon: Users,
      iconColor: "text-green-600",
      subTitle2: "Comunicados gerais",
      borderColor: "border-b-green-600",
    },
    {
      title: "Para Admin",
      value: comunicadoStats.administradores,
      icon: Shield,
      iconColor: "text-purple-700",
      subTitle: "Gestão interna",
      borderColor: "border-b-purple-700",
    },
    // NOVO CARD: Contagem para Síndicos (opcional, mas bom para consistência)
    {
      title: "Para Síndicos",
      value: comunicadoStats.sindicos,
      icon: Users,
      iconColor: "text-blue-500",
      subTitle: "Para colegas síndicos",
      borderColor: "border-b-blue-500",
    },
  ];

  return (
    <div className="container mx-auto mt-6 space-y-6">
      {/* Cards de estatísticas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {cardsData.slice(0, 4).map((card, i) => { // Mantém a visualização de 4 cards
          const Icon = card.icon;
          return (
            <AnimationWrapper key={card.title} delay={i * 0.2}>
              <Card className={`border-b-4 ${card.borderColor}`}>
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <div className="flex flex-col">
                    <p className="font-bold text-4xl text-foreground">{card.value}</p>
                    {card.subTitle1 && <p className="text-red-500 text-sm mt-1">{card.subTitle1}</p>}
                    {card.porcentagem && <p className="text-accent text-sm mt-1">{card.porcentagem}</p>}
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

      {/* Cabeçalho e botão criar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ">Comunicados</h1>
        <Button className="flex gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Criar Comunicado
        </Button>
      </div>

      {/* Filtro por destinatário */}
      <Tabs value={filtro} onValueChange={setFiltro}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger className="cursor-pointer" value="todos">Todos</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="administradores">Administradores</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="usuários">Usuários</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="sindicos">Síndicos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de comunicados */}
      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Comunicados</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {comunicadosFiltrados.map((c) => (
              <div key={c.id} className="flex items-center py-4 gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500/10">
                  {c.lido ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Bell className="w-5 h-5 text-sky-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{c.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.subject}</p>
                </div>
                <div className="w-36 text-sm text-center">
                  {c.addressee === "administradores" ? "Administradores" : c.addressee === "usuários" ? "Usuários" : "Síndicos"}
                </div>
                <div className="w-40 text-sm text-center">
                  {c.criado_em ? new Date(c.criado_em).toLocaleString("pt-BR") : "-"}
                </div>

                {/* Botões de ações */}
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

                  {/* <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setComunicadoParaMarcar(c);
                          setShowLidoModal(true);
                        }}
                        disabled={c.lido}
                      >
                        <Check size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{c.lido ? "Lido" : "Marcar como lido"}</TooltipContent>
                  </Tooltip> */}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
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
                    {/* NOVO: Adiciona a opção Síndicos */}
                    <SelectItem value="sindicos">Síndicos</SelectItem> 
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
        <DialogContent className="sm:rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
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

              <div className="flex flex-col ">
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
                    {/* NOVO: Adiciona a opção Síndicos */}
                    <SelectItem value="sindicos">Síndicos</SelectItem> 
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

      {/* Modal Excluir (sem alteração) */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
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

      {/* Modal Marcar como Lido (sem alteração) */}
      <Dialog open={showLidoModal} onOpenChange={setShowLidoModal}>
        <DialogContent className="sm:max-w- rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
          <div className="h-2 w-full rounded-t-md bg-green-600" />
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
              Marcar como Lido
            </DialogTitle>
          </DialogHeader>

          <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
            <p className="text-lg">
              Deseja realmente marcar o comunicado <strong>{comunicadoParaMarcar?.title}</strong> como lido?
            </p>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="w-32 border-border text-foreground"
              onClick={() => setShowLidoModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="w-32 bg-green-600 text-white hover:bg-green-700"
              onClick={async () => {
                await marcarComoLido(comunicadoParaMarcar.id);
                setShowLidoModal(false);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}