"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/**
 * Hook para CRUD de condomínios
 * @param {Array} initialCondominios - Lista inicial de condomínios
 * @param {Function} refreshFn - Função para atualizar a lista após mudanças
 * @param {string} baseURL - URL base da API (padrão: /api/condominios)
 */
export function useCondominios(
  initialCondominios = [],
  refreshFn,
  baseURL = "/condominios"
) {
  const [condominios, setCondominios] = useState(initialCondominios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Criar condomínio
  const addCondominio = async (novoCondominio) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(baseURL, novoCondominio);
      if (res?.error) throw new Error(res.error);

      setCondominios((prev) => [...prev, res]);
      toast.success("Condomínio criado com sucesso!");
      await refreshFn?.();
      return res;
    } catch (err) {
      const msg = err?.message || "Erro ao criar condomínio!";
      toast.error(msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Editar condomínio
  const editCondominio = async (id, dadosAtualizados) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`${baseURL}/${id}`, dadosAtualizados);
      if (res?.error) throw new Error(res.error);

      setCondominios((prev) =>
        prev.map((c) => (c.id === id ? res : c))
      );
      toast.success("Condomínio atualizado com sucesso!");
      await refreshFn?.();
      return res;
    } catch (err) {
      const msg = err?.message || "Erro ao editar condomínio!";
      toast.error(msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Excluir condomínio
  const removeCondominio = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.del(`${baseURL}/${id}`);
      if (res?.error) throw new Error(res.error);

      setCondominios((prev) => prev.filter((c) => c.id !== id));
      toast.success("Condomínio excluído com sucesso!");
      await refreshFn?.();
      return true;
    } catch (err) {
      const msg = err?.message || "Erro ao excluir condomínio!";
      toast.error(msg);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    condominios,
    setCondominios,
    loading,
    error,
    addCondominio,
    editCondominio,
    removeCondominio,
  };
}
