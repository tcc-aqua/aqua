"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import SuporteFilter from "../Filters/Suporte";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";
import { 
  MessageCircle, 
  MailWarning, 
  Clock, 
  AlertTriangle, 
  User, 
  Mail, 
  Calendar, 
  Trash2
} from "lucide-react";
import { PaginationDemo } from "../pagination/pagination";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"
import { Separator } from "../ui/separator";

export default function SuporteDashboard() {

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [replyingTicketId, setReplyingTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          respondido_por,
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

  
  const handleDeleteTicket = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Falha ao excluir ticket.");

      toast.success("Ticket excluído com sucesso!");
      fetchData();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir ticket.");
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
                <Card className="hover:border-sky-400 dark:hover:border-sky-950">
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">
                      <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>

                      {card.subTitle1 && <p className="text-yellow-500 text-sm mt-1">{card.subTitle1}</p>}
                      {card.porcentagem && <p className="text-blue-500 text-sm mt-1">{card.porcentagem}</p>}
                      {card.subTitle && <p className="text-destructive text-sm mt-1">{card.subTitle}</p>}
                      {card.subTitle2 && <p className="text-green-600 text-sm mt-1">{card.subTitle2}</p>}
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
                  <Card className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-sky-400">

                    <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">

                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded 
                            ${ticket.status === "pendente"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-green-500/10 text-green-600"
                            }`}>
                            {ticket.status}
                          </span>

                          <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded 
                            ${ticket.status === "resolvido"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-sky-500/10 text-sky-600"
                            }`}>
                            {ticket.status === "resolvido" ? "Respondida" : "Não Respondida"}
                          </span>
                        </div>

                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReply(ticket.id);
                            }}
                            className={`p-1.5 text-white rounded-full shadow-md transition 
                              ${isReplying ? "bg-orange-600 hover:bg-orange-700" : "bg-sky-600 hover:bg-sky-700"}`}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 cursor-pointer text-red-500 bg-gray-100 dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                      <CardTitle className="text-xl font-bold truncate">{ticket.assunto}</CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3">

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-2 border-b text-xs">

                        <p className="font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-sky-600" />
                          {ticket.remetente_nome}
                        </p>

                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {ticket.remetente_email}
                        </p>

                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(ticket.criado_em)}
                        </p>

                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">

                        <h3 className="text-xs font-semibold uppercase text-sky-700 mb-1">Mensagem</h3>
                        <p className="text-sm">{ticket.mensagem}</p>

                        {ticket.resposta && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/50 rounded-md border-l-4 border-green-500">
                            <h4 className="text-xs font-semibold uppercase text-green-700 mb-1">Resposta</h4>
                            <p className="text-sm">{ticket.resposta}</p>
                          </div>
                        )}

                      </div>

                    </CardContent>

                    {isReplying && (
                      <CardFooter className="p-4 border-t bg-gray-50">
                        <div className="w-full space-y-2">

                          <textarea
                            rows="3"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="w-full p-2 text-sm bg-white border rounded-md"
                            placeholder="Escreva sua resposta..."
                          />

                          <button
                            onClick={() => handleSendReply(ticket.id)}
                            className="w-full py-1.5 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Enviar Resposta
                          </button>

                        </div>
                      </CardFooter>
                    )}

                    <Separator />
                  </Card>
                </AnimationWrapper>
              );
            })
          )}
        </div>

        {/* ==== MODAL DE EXCLUSÃO ==== */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[640px] rounded-2xl shadow-2xl bg-background border overflow-hidden">
            
            <div className="h-2 w-full bg-red-600" />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b mt-3">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <DialogTitle className="text-2xl font-bold">Confirmação</DialogTitle>
            </DialogHeader>

            <div className="mt-5 space-y-4 px-4 text-center text-foreground/90">
              <p className="text-lg">
                Deseja realmente excluir o ticket <strong>{selectedTicket?.assunto}</strong>?
              </p>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t pt-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>

              <Button
                className="px-6 py-3 text-white bg-red-600 hover:bg-red-700"
                onClick={() => {
                  handleDeleteTicket(selectedTicket?.id);
                  setShowDeleteModal(false);
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PaginationDemo className='my-20' />
      </div>
    </>
  );
}
