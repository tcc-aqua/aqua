"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Buscar todos os administradores
  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admins");
      const data = Array.isArray(res) ? res : res?.data || [];
      setAdmins(data);
    } catch (err) {
      toast.error(err?.message || "Erro ao buscar administradores!");
      setError(err?.message || "Erro ao buscar administradores!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar administradores ativos
  const fetchAtivos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admins/ativos");
      const data = Array.isArray(res) ? res : res?.data || [];
      setAdmins(data);
    } catch (err) {
      toast.error("Erro ao buscar administradores ativos!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar administradores inativos
  const fetchInativos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admins/inativos");
      const data = Array.isArray(res) ? res : res?.data || [];
      setAdmins(data);
    } catch (err) {
      toast.error("Erro ao buscar administradores inativos!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Criar novo administrador (sem o campo name)
  const addAdmin = async (novo) => {
    setLoading(true);
    try {
      const payload = {
        email: novo.email,
        password: novo.password,
        role: novo.role,
      };

      const res = await api.post("/admins", payload);
      const data = res?.data || res;
      if (!data || data.error) throw new Error(data?.error || "Erro ao criar administrador!");

      setAdmins((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
      toast.success("Administrador criado com sucesso!");
    } catch (err) {
      toast.error(err?.message || "Erro ao criar administrador!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualizar dados de administrador (email, role, etc.)
  const editAdmin = async (id, dados) => {
    setLoading(true);
    try {
      const res = await api.put(`/admins/${id}`, dados);
      const data = res?.data || res;
      if (!data || data.error) throw new Error(data?.error || "Erro ao atualizar administrador!");

      setAdmins((prev) =>
        Array.isArray(prev) ? prev.map((a) => (a.id === id ? data : a)) : [data]
      );
      toast.success("Administrador atualizado com sucesso!");
    } catch (err) {
      toast.error(err?.message || "Erro ao atualizar administrador!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualizar senha do administrador logado
  const updatePassword = async (dados) => {
    setLoading(true);
    try {
      const res = await api.patch("/admins/me", dados);
      const data = res?.data || res;
      if (data?.error) throw new Error(data.error);

      toast.success("Senha atualizada com sucesso!");
    } catch (err) {
      toast.error(err?.message || "Erro ao atualizar senha!");
    } finally {
      setLoading(false);
    }
  };

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    fetchAtivos,
    fetchInativos,
    addAdmin,
    editAdmin,
    updatePassword,
  };
}
