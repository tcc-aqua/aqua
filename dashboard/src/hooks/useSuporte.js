"use client";

import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const API_URL = "http://localhost:3333/api/suporte";

export function useSuporte() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
const fetchTickets = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const token = Cookies.get("token");

    const res = await fetch(API_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error("Erro ao buscar tickets.");

    const data = await res.json();

    const ticketsArray = Array.isArray(data.mensagens) ? data.mensagens : [];
    const total = data.total ?? ticketsArray.length; // pega total do JSON, se existir

    return { tickets: ticketsArray, total };
  } catch (err) {
    console.error(err);
    setError(err.message || String(err));
    return { tickets: [], total: 0 };
  } finally {
    setLoading(false);
  }
}, []);


 
  const sendReply = useCallback(async (ticketId, replyMessage) => {
    try {
      if (!replyMessage.trim()) {
        toast.error("Preencha a resposta antes de enviar.");
        return false;
      }

      const token = Cookies.get("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return false;
      }

      const decoded = jwtDecode(token);
      const respondido_por = decoded.role || "Desconhecido";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: ticketId, resposta: replyMessage, respondido_por }),
      });

      if (!res.ok) throw new Error("Falha ao enviar resposta.");

      toast.success("Resposta enviada com sucesso!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar resposta.");
      return false;
    }
  }, []);


  const deleteTicket = useCallback(async (ticketId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return false;
      }

      const res = await fetch(`${API_URL}/${ticketId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar ticket.");

      toast.success("Ticket deletado com sucesso!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar ticket.");
      return false;
    }
  }, []);

 
const markAsViewed = useCallback(async (ticketId) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Usuário não autenticado.");
      return false;
    }

   const res = await fetch(`${API_URL}/${ticketId}/visualizado`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});


    if (!res.ok) throw new Error(`Erro ${res.status} ao marcar como visualizado.`);

    toast.success("Ticket marcado como visualizado!");
    return true;
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Erro ao marcar como visualizado.");
    return false;
  }
}, []);


  return {
    loading,
    error,
    fetchTickets,
    sendReply,
    deleteTicket,
    markAsViewed,
  };
}
