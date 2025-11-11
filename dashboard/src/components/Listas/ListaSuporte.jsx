"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import SuporteFilter from "../Filters/Suporte";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";
import { MessageCircle, MailWarning, Clock, AlertTriangle, User, Mail, Calendar } from "lucide-react";
import { PaginationDemo } from "../pagination/pagination";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"

export default function SuporteDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyingTicketId, setReplyingTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const API_URL = "http://localhost:3333/api/suporte";

  const calculateCardsData = (currentTickets) => {
    const total = currentTickets.length;
    const naoLidas = currentTickets.filter(t => t.status === "pendente").length;
    const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
    const recentes = currentTickets.filter(t => new Date(t.criado_em) > umaHoraAtras).length;
    const altaPrioridade = currentTickets.filter(t => t.prioridade === "alta" || t.status === "pendente").length;

    const newCards = [
      {
        title: "Total de Mensagens",
        value: total,
        icon: MessageCircle,
        iconColor: "text-blue-500",
        porcentagem: "Visão Geral",
      },
      {
        title: "Mensagens Não Lidas",
        value: naoLidas,
        icon: MailWarning,
        iconColor: "text-yellow-500",
        subTitle1: naoLidas > 0 ? `${naoLidas} para ação` : "Tudo Certo!",
      },
      {
        title: "Mensagens Recentes",
        value: recentes,
        icon: Clock,
        iconColor: "text-green-500",
        subTitle2: `Últimos 60 min`,
      },
      {
        title: "Prioridade Alta",
        value: altaPrioridade,
        icon: AlertTriangle,
        iconColor: "text-red-500",
        subTitle: altaPrioridade > 0 ? "Ação Imediata" : "Sem Urgência",
      },
    ];

    setCardsData(newCards);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar tickets de suporte.");

      const data = await res.json();
      const ticketsArray = Array.isArray(data) ? data : data.docs ?? [];

      setTickets(ticketsArray);
      calculateCardsData(ticketsArray);

    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      setCardsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  try {
    if (!replyMessage.trim()) {
      toast.error("Preencha a resposta antes de enviar.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const decoded = jwtDecode(token);
    const respondido_por = decoded.role || "Desconhecido";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ticketId,
        resposta: replyMessage,
        respondido_por, // agora vem do token
      }),
    });

    if (!response.ok) {
      throw new Error("Falha na requisição");
    }

    toast.success("Resposta enviada com sucesso!");
    setReplyMessage("");
    setReplyingTicketId(null);
    fetchData();
  } catch (error) {
    console.error("Erro ao enviar resposta:", error);
    toast.error("Erro ao enviar resposta.");
  }
};



  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  return (
    <>
    <div className="p-4">
      <Toaster position="top-right" richColors />

      <div className="mb-10">
        <SuporteFilter onApply={(filters) => fetchData(filters)} />
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cardsData.map((card, i) => {
          const Icon = card.icon;
          return (
            <AnimationWrapper key={card.title} delay={i * 0.2}>
              <Card className=" hover:border-sky-400 dark:hover:border-sky-700">
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <div className="flex flex-col">
                    <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                    {card.subTitle1 && (
                      <p className="text-yellow-500 text-sm mt-1">
                        {card.subTitle1}
                      </p>
                    )}
                    {card.porcentagem && !card.valueAtivos && (
                      <p className="text-sm mt-1 text-blue-500">{card.porcentagem}</p>
                    )}
                    {card.subTitle && (
                      <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>
                    )}
                    {card.subTitle2 && (
                      <p className="text-sm mt-1 text-green-600">{card.subTitle2}</p>
                    )}
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
                <Card
                  className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-sky-400 dark:hover:border-sky-700"
                  role="listitem"
                >

                  <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700">

                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase rounded tracking-wide 
                          ${ticket.status === "pendente"
                              ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                              : "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                            }`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase rounded tracking-wide 
                          ${ticket.status === "resolvido"
                              ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                              : "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
                            }`}
                        >
                          {ticket.status === "resolvido" ? "Respondida" : "Não Respondida"}
                        </span>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReply(ticket.id);
                          }}
                          className={`p-1.5 text-white rounded-full shadow-md transition ${isReplying ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500/50' : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500/50'}`}
                          title={isReplying ? "Fechar Resposta" : "Responder Ticket"}
                        >
                          <MessageCircle className="w-4 h-4 cursor-pointer" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Excluir ticket ${ticket.id}`);
                          }}
                          className="p-1.5 cursor-pointer text-red-500 bg-gray-100 dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
                          title="Excluir Ticket"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>

                    <CardTitle className="text-xl font-bold truncate max-w-full">
                      {ticket.assunto}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-2 border-b border-dashed border-gray-200 dark:border-gray-700 text-xs">

                      <p className="font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                        <span className="font-semibold"></span> {ticket.remetente_nome || ticket.remetente_id}
                      </p>

                      <p className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="font-semibold"></span> {ticket.remetente_email || 'N/A'}
                      </p>

                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="font-semibold"></span> {formatDate(ticket.criado_em)}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1">Mensagem</h3>
                      <p className="text-sm line-clamp-3">
                        {ticket.mensagem}
                      </p>
                    </div>

                  </CardContent>

                  {isReplying && (
                    <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                      <div className="w-full space-y-2">
                        <label htmlFor={`reply-${ticket.id}`} className="sr-only">Sua Resposta</label>
                        <textarea
                          id={`reply-${ticket.id}`}
                          rows="3"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="w-full p-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-900 dark:border-gray-600"
                          placeholder="Escreva sua resposta (min. 3 linhas)..."
                        ></textarea>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReply(ticket.id);
                          }}
                          className="w-full py-1.5 text-sm font-semibold cursor-pointer rounded-md shadow-md hover:bg-blue-300 transition"
                        >
                          Enviar Resposta
                        </button>
                      </div>
                    </CardFooter>
                  )}

                </Card>
              </AnimationWrapper>
            );
          })
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Ticket</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-2">
            <p><strong>Assunto:</strong> {selectedTicket?.assunto}</p>
            <p><strong>Mensagem:</strong> {selectedTicket?.mensagem}</p>
            <p><strong>Remetente:</strong> {selectedTicket?.remetente_id}</p>
            <p><strong>Status:</strong> {selectedTicket?.status}</p>
            <p><strong>Resposta:</strong> {selectedTicket?.resposta ?? "-"}</p>
            <p><strong>Criado em:</strong> {formatDate(selectedTicket?.criado_em)}</p>
            <p><strong>Atualizado em:</strong> {formatDate(selectedTicket?.atualizado_em)}</p>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setSelectedTicket(null);
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
        <PaginationDemo className='my-2' />
      </Dialog>
    </div>
    </>
  );
}