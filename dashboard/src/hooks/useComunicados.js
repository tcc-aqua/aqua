"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useComunicados() {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Busca todos os comunicados
  const fetchComunicados = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/comunicados");
      const data = Array.isArray(res) ? res : res?.data || [];
      setComunicados(data);
    } catch (err) {
      const msg = err?.message || "Erro ao buscar comunicados";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Criar comunicado
  const addComunicado = async (novo) => {
    setLoading(true);
    try {
      const res = await api.post("/comunicados", novo);
      const data = res?.data || res;

      if (!data || !data.id) throw new Error("Erro ao criar comunicado");

      toast.success("Comunicado criado com sucesso!");
      
      // 🔹 Atualiza a tabela puxando do backend
      await fetchComunicados();
    } catch (err) {
      toast.error(err?.message || "Erro ao criar comunicado");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Editar comunicado
  const editComunicado = async (id, dados) => {
    setLoading(true);
    try {
      const res = await api.put(`/comunicados/${id}`, dados);
      const updated = res?.data || res;

      if (!updated || updated.error) throw new Error(updated?.error || "Erro ao atualizar comunicado");

      toast.success("Comunicado atualizado com sucesso!");
      
      // 🔹 Atualiza a tabela puxando do backend
      await fetchComunicados();
    } catch (err) {
      toast.error(err?.message || "Erro ao atualizar comunicado");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir comunicado
  const removeComunicado = async (id) => {
    setLoading(true);
    try {
      const res = await api.del(`/comunicados/${id}`);
      if (res?.error) throw new Error(res?.message || "Erro ao excluir comunicado");

      toast.success("Comunicado excluído com sucesso!");
      
      // 🔹 Atualiza a tabela puxando do backend
      await fetchComunicados();
    } catch (err) {
      toast.error(err?.message || "Erro ao excluir comunicado");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualiza ao montar o hook
  useEffect(() => {
    fetchComunicados();
  }, []);

  return {
    comunicados,
    loading,
    error,
    fetchComunicados,
    addComunicado,
    editComunicado,
    removeComunicado,
  };
}
