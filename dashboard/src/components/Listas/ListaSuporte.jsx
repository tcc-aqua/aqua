"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import SuporteFilter from "../Filters/Suporte";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";

// Importações de ícones de exemplo (você precisará ter esses ícones disponíveis)
// Exemplo: npm install lucide-react
import { MessageCircle, MailWarning, Clock, AlertTriangle } from "lucide-react";

export default function SuporteDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Novo estado para armazenar os dados dos cards
  const [cardsData, setCardsData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const API_URL = "http://localhost:3333/api/suporte";

  // Função para calcular os dados dos cards a partir dos tickets
  const calculateCardsData = (currentTickets) => {
    const total = currentTickets.length;
    const naoLidas = currentTickets.filter(t => t.status === "pendente").length;
    
    // Simulação para "Recentes": tickets criados na última hora (ajuste conforme a sua lógica real)
    const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
    const recentes = currentTickets.filter(t => new Date(t.criado_em) > umaHoraAtras).length;

    // Simulação para "Alta Prioridade" (assumindo um campo 'prioridade' ou baseando-se no assunto/remetente)
    // Usaremos "pendente" como proxy para alta prioridade se não houver campo de prioridade real
    const altaPrioridade = currentTickets.filter(t => t.prioridade === "alta" || t.status === "pendente").length;


    // Definindo o array de cards com os valores calculados
    const newCards = [
      {
        title: "Total de Mensagens",
        value: total,
        icon: MessageCircle,
        iconColor: "text-blue-500",
        porcentagem: "Visão Geral", // Mock de subtítulo
      },
      {
        title: "Mensagens Não Lidas",
        value: naoLidas,
        icon: MailWarning,
        iconColor: "text-red-500",
        subTitle: naoLidas > 0 ? `${naoLidas} para ação` : "Tudo Certo!",
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
        iconColor: "text-yellow-500",
        subTitle: altaPrioridade > 0 ? "Ação Imediata" : "Sem Urgência",
      },
    ];

    setCardsData(newCards);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Aqui você pode adaptar o fetch para usar filtros, se necessário
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar tickets de suporte.");

      const data = await res.json();
      const ticketsArray = Array.isArray(data) ? data : data.docs ?? [];
      
      setTickets(ticketsArray);
      calculateCardsData(ticketsArray); // Chama o cálculo dos cards após receber os tickets
      
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      setCardsData([]); // Limpa os cards em caso de erro
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

  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  return (
    <div className="p-4">
      <Toaster position="top-right" richColors />

      <div className="mb-10">
        {/* Você precisará ajustar o SuporteFilter para não receber 'filters' se o 'fetchData' não for alterado para usá-los */}
        <SuporteFilter onApply={(filters) => fetchData(filters)} /> 
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"> {/* Adicionado mb-8 para espaçamento */}
        {cardsData.map((card, i) => { // Usa cardsData
          const Icon = card.icon;
          return (
            <AnimationWrapper key={card.title} delay={i * 0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl text-foreground">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between -mt-6">
                  <div className="flex flex-col">
                    <p className="font-bold text-4xl text-foreground">{card.value ?? 0}</p>
                    {card.valueAtivos && (
                      <p className="text-purple-700 text-sm mt-1">
                        {card.valueAtivos.casas} casas + {card.valueAtivos.apartamentos} apartamentos
                      </p>
                    )}
                    {card.porcentagem && !card.valueAtivos && (
                      <p className="text-sm mt-1 text-green-600">{card.porcentagem}</p>
                    )}
                    {card.subTitle && (
                      <p className="text-sm mt-1 text-destructive">{card.subTitle}</p>
                    )}
                    {card.subTitle2 && (
                      <p className="text-sm mt-1 text-blue-500">{card.subTitle2}</p>
                    )}
                  </div>
                  {/* Note: A classe bg-${card.iconColor} não funcionará com Tailwind CSS a menos que você configure cores dinâmicas ou use uma classe de cor predefinida */}
                  <Icon className={`w-8 h-8 ${card.iconColor}`} /> 
                </CardContent>
              </Card>
            </AnimationWrapper>
          );
        })}
      </section>
      
      {/* O resto do seu código para exibir os tickets */}
      <div className="flex flex-col gap-4">
        {tickets.length === 0 ? (
          <p>Nenhum ticket encontrado.</p>
        ) : (
          tickets.map((ticket, i) => (
            <AnimationWrapper key={ticket.id || i} delay={i * 0.1}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setSelectedTicket(ticket); setShowModal(true); }}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {ticket.assunto}{" "}
                    <span className={`ml-2 text-sm font-normal capitalize ${ticket.status === "pendente" ? "text-red-500" : "text-green-500"}`}>
                      [{ticket.status}]
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 truncate">{ticket.mensagem}</p>
                  <p className="mt-1 text-xs text-foreground/60">Remetente: {ticket.remetente_id}</p>
                  <p className="mt-1 text-xs text-foreground/60">Criado em: {formatDate(ticket.criado_em)}</p>
                </CardContent>
              </Card>
            </AnimationWrapper>
          ))
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
      </Dialog>
    </div>
  );
}