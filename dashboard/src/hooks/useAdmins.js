"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admins");
      setAdmins(res?.data || []);
    } catch (err) {
      toast.error("Erro ao buscar administradores!");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


const addAdmin = async (novo) => {
  setLoading(true);
  try {
    const payload = {
      email: novo.email,
      password: novo.password,

    };

    const res = await api.post("/admins", payload);

    setAdmins((prev) => [...prev, res?.data || res]);
    toast.success("Administrador criado com sucesso!");
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || "Erro ao criar administrador!";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};



  const editAdmin = async (id, dados) => {
    setLoading(true);
    try {
      const res = await api.put(`/admins/${id}`, dados);

      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? res.data : a))
      );

      toast.success("Administrador atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar administrador!");
    } finally {
      setLoading(false);
    }
  };


  const updatePassword = async (dados) => {
    setLoading(true);
    try {
      await api.patch("/admins/me", dados);
      toast.success("Senha atualizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar senha!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    addAdmin,
    editAdmin,
    updatePassword,
  };
}
