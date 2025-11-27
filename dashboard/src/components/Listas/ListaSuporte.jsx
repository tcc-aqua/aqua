"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import SuporteFilter from "../Filters/Suporte";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";
import { MessageCircle, MailWarning, Clock, AlertTriangle, User, Mail, Calendar, Trash, Check } from "lucide-react";
import { PaginationDemo } from "../pagination/pagination";

import { useSuporte } from "@/hooks/useSuporte";

export default function SuporteDashboard() {
  const [tickets, setTickets] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [replyingTicketId, setReplyingTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Novos estados para os modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLidoModal, setShowLidoModal] = useState(false);
  const [ticketParaDeletar, setTicketParaDeletar] = useState(null);
  const [ticketParaMarcar, setTicketParaMarcar] = useState(null);

  const { loading, error, fetchTickets, sendReply, deleteTicket, markAsViewed } = useSuporte();
  
const calculateCardsData = (currentTickets, totalFromServer) => {
  const total = totalFromServer ?? currentTickets.length; // usa o total do JSON
  const naoLidas = currentTickets.filter(t => t.status === "pendente").length;
  const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
  const recentes = currentTickets.filter(t => new Date(t.criado_em) > umaHoraAtras).length;
  const altaPrioridade = currentTickets.filter(t => t.prioridade === "alta" || t.status === "pendente").length;

    const newCards = [
    {
      title: "Total de Mensagens",
      value: total,
      icon: MessageCircle,
      iconColor: "text-sky-500",
      porcentagem: "Visão Geral",
      borderColor:" border-b-sky-500 "
    },
      { title: "Mensagens Não Lidas", value: naoLidas, icon: MailWarning, iconColor: "text-yellow-500", subTitle1: naoLidas > 0 ? `${naoLidas} para ação` : "Tudo Certo!", borderColor:" border-b-yellow-500 " },
      { title: "Mensagens Recentes", value: recentes, icon: Clock, iconColor: "text-green-500", subTitle2: `Últimos 60 min`, borderColor:" border-b-green-500 " },
      { title: "Prioridade Alta", value: altaPrioridade, icon: AlertTriangle, iconColor: "text-red-500", subTitle: altaPrioridade > 0 ? "Ação Imediata" : "Sem Urgência", borderColor:" border-b-red-500 " },
    ];

    setCardsData(newCards);
  };

const loadTickets = async () => {
  const { tickets: ticketsArray, total } = await fetchTickets();
  setTickets(ticketsArray);
  calculateCardsData(ticketsArray, total); 
};


  useEffect(() => {
    loadTickets();
  }, [page]);

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  const handleToggleReply = (ticketId) => {
    setReplyingTicketId(replyingTicketId === ticketId ? null : ticketId);
    setReplyMessage("");
  };

  const handleSendReply = async (ticketId) => {
    const success = await sendReply(ticketId, replyMessage);
    if (success) {
      setReplyMessage("");
      setReplyingTicketId(null);
      loadTickets();
    }
  };

  const abrirDeleteModal = (ticket) => {
    setTicketParaDeletar(ticket);
    setShowDeleteModal(true);
  };

  const abrirLidoModal = (ticket) => {
    setTicketParaMarcar(ticket);
    setShowLidoModal(true);
  };

  const confirmarDelete = async () => {
    if (!ticketParaDeletar) return;
    await deleteTicket(ticketParaDeletar.id);
    setShowDeleteModal(false);
    setTicketParaDeletar(null);
    loadTickets();
  };

  const confirmarLido = async () => {
    if (!ticketParaMarcar) return;
    await markAsViewed(ticketParaMarcar.id);
    setShowLidoModal(false);
    setTicketParaMarcar(null);
    loadTickets();
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <SuporteFilter onApply={(filters) => loadTickets(filters)} />
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cardsData.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimationWrapper key={card.title} delay={i * 0.2}>
                <Card className={`border-b-4 ${card.borderColor}`}>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">
                      <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                      {card.subTitle1 && <p className="text-yellow-500 text-sm mt-1">{card.subTitle1}</p>}
                      {card.porcentagem && !card.valueAtivos && <p className="text-sm mt-1 text-sky-500">{card.porcentagem}</p>}
                      {card.subTitle && <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>}
                      {card.subTitle2 && <p className="text-sm mt-1 text-green-600">{card.subTitle2}</p>}
                    </div>
                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </section>

        <div className="flex flex-col gap-4 font-sans">
          {tickets.length === 0 ? (
            <p>Nenhum ticket encontrado.</p>
          ) : (
            tickets.map((ticket, i) => {
              const isReplying = replyingTicketId === ticket.id;

              return (
                <AnimationWrapper key={ticket.id || i} delay={i * 0.1}>
                  <Card className="relative overflow-hidden rounded-lg  border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-sky-400 dark:hover:border-sky-950 "  role="listitem">
                    <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700  ">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2">
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase rounded tracking-wide ${ticket.status === "pendente" ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400" : "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"}`}>{ticket.status}</span>
                          <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase rounded tracking-wide ${ticket.status === "resolvido" ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400" : "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"}`}>{ticket.status === "resolvido" ? "Respondida" : "Não Respondida"}</span>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); handleToggleReply(ticket.id); }} className={`p-1.5 text-white rounded-full shadow-md transition ${isReplying ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500/50' : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500/50'}`} title={isReplying ? "Fechar Resposta" : "Responder Ticket"}>
                            <MessageCircle className="w-4 h-4 cursor-pointer" />
                          </button>

                          <button onClick={(e) => { e.stopPropagation(); abrirDeleteModal(ticket); }} className="p-1.5 cursor-pointer text-red-500 bg-gray-100 dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition" title="Excluir Ticket">
                            <Trash className="w-4 h-4" />
                          </button>

                          <button onClick={(e) => { e.stopPropagation(); abrirLidoModal(ticket); }} className="p-1.5 text-white bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition" title="Marcar como Visualizado">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold truncate max-w-full">{ticket.assunto}</CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-2 border-b border-dashed border-gray-200 dark:border-gray-700 text-xs">
                        <p className="font-medium flex items-center gap-1"><User className="w-3 h-3 text-sky-600 dark:text-sky-400" /> {ticket.remetente_nome || ticket.remetente_id}</p>
                        <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> {ticket.remetente_email || 'N/A'}</p>
                        <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(ticket.criado_em)}</p>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1">Mensagem</h3>
                        <p className="text-sm line-clamp-3">{ticket.mensagem}</p>

                        {ticket.resposta && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/50 rounded-md border-l-4 border-green-500">
                            <h4 className="text-xs font-semibold uppercase text-green-700 dark:text-green-300 mb-1">Resposta</h4>
                            <p className="text-sm">{ticket.resposta}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {isReplying && (
                      <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                        <div className="w-full space-y-2">
                          <label htmlFor={`reply-${ticket.id}`} className="sr-only">Sua Resposta</label>
                          <textarea id={`reply-${ticket.id}`} rows="3" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-900 dark:border-gray-600" placeholder="Escreva sua resposta (min. 3 linhas)..." />
                          <button onClick={(e) => { e.stopPropagation(); handleSendReply(ticket.id); }} className="w-full py-1.5 text-sm font-semibold cursor-pointer rounded-md shadow-md hover:bg-blue-300 transition">Enviar Resposta</button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </AnimationWrapper>
              );
            })
          )}
          <PaginationDemo currentPage={page} totalPages={totalPages} onChangePage={(newPage) => setPage(newPage)} maxVisible={5} />
        </div>

        {/* Modal Excluir */}
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
                Deseja realmente excluir o ticket <strong>{ticketParaDeletar?.assunto}</strong>?
              </p>
            </div>
            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
              <Button className="flex items-center gap-2 px-6 py-3 text-white bg-red-600 hover:bg-red-700" onClick={confirmarDelete}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Marcar como Lido */}
        <Dialog open={showLidoModal} onOpenChange={setShowLidoModal}>
          <DialogContent className="sm:rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
            <div className="h-2 w-full rounded-t-md bg-green-600" />
            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Marcar como Lido</DialogTitle>
            </DialogHeader>
            <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
              <p className="text-lg">
                Deseja realmente marcar o ticket <strong>{ticketParaMarcar?.assunto}</strong> como lido?
              </p>
            </div>
            <DialogFooter className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" className="w-32 border-border text-foreground" onClick={() => setShowLidoModal(false)}>Cancelar</Button>
              <Button type="button" className="w-32 bg-green-600 text-white hover:bg-green-700" onClick={confirmarLido}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}
