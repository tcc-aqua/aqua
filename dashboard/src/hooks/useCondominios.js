"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useCondominios() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os condomínios
  const fetchCondominios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/condominios");
      const data = Array.isArray(res) ? res : res?.data || [];
      setCondominios(data);
    } catch (err) {
      const msg = err?.message || "Erro ao buscar condomínios!";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCondominios();
  }, []);

  // Criar condomínio
  const addCondominio = async (novo) => {
    setLoading(true);
    try {
      const res = await api.post("/condominios", novo);
      const data = res?.data || res; // depende do formato da API
      if (!data || data.error) throw new Error(data?.error || "Erro ao criar");

      setCondominios((prev) => Array.isArray(prev) ? [...prev, data] : [data]);
      toast.success("Condomínio criado com sucesso!");
    } catch (err) {
      toast.error(err?.message || "Erro ao criar condomínio!");
    } finally {
      setLoading(false);
    }
  };

  // Editar condomínio
const editCondominio = async (id, dados) => {
  setLoading(true);
  try {
    // Chama a rota correta passando os dados certos
    const res = await api.put(`/condominios/${id}`, dados);

    const updated = res?.data || res;

    if (!updated || updated.error) {
      throw new Error(updated?.error || "Erro ao atualizar");
    }

    // Atualiza no estado pela chave 'id'
    setCondominios((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    toast.success("Condomínio atualizado com sucesso!");
  } catch (err) {
    toast.error(err?.message || "Erro ao atualizar condomínio!");
  } finally {
    setLoading(false);
  }
};

  // Excluir condomínio
  const removeCondominio = async (id) => {
    setLoading(true);
    try {
      const res = await api.del(`/condominios/${id}`);
      if (res?.error) throw new Error(res.error);

      setCondominios((prev) =>
        Array.isArray(prev) ? prev.filter((c) => c.id !== id) : []
      );
      toast.success("Condomínio excluído com sucesso!");
    } catch (err) {
      toast.error(err?.message || "Erro ao excluir condomínio!");
    } finally {
      setLoading(false);
    }
  };
const updateCondominioName = async (id, novoNome) => {
  try {
    const res = await api.put(`/condominios/${id}/name`, { name: novoNome });
    const data = res?.data || res;

    if (data?.error) throw new Error(data.error || "Erro ao atualizar nome");

    setCondominios(prev =>
      prev.map(c =>
        c.condominio_id === id ? { ...c, condominio_nome: novoNome } : c
      )
    );

  } catch (err) {
 
    toast.error(err.message || "Erro ao atualizar nome do condomínio!");
    throw err; 
  }
};



  return {
    condominios,
    loading,
    error,
    fetchCondominios,
    addCondominio,
    editCondominio,
    removeCondominio,
    updateCondominioName,
  };
}
