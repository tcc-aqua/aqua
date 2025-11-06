"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AnimationWrapper from "../Layout/Animation/Animation";

export default function SuporteDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const API_URL = "http://localhost:3333/api/suporte";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar tickets de suporte.");

      const data = await res.json();
      const ticketsArray = Array.isArray(data) ? data : data.docs ?? [];
      setTickets(ticketsArray);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
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

      <div className="flex flex-col gap-4">
        {tickets.length === 0 ? (
          <p>Nenhum ticket encontrado.</p>
        ) : (
          tickets.map((ticket, i) => (
            <AnimationWrapper key={ticket.id} delay={i * 0.1}>
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
