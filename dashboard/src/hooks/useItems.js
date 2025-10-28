"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export default function useItems(baseURL, refreshFn = null, itemsInitial = []) {
  const [items, setItems] = useState(itemsInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ➕ Criar item
  const addItem = useCallback(async (newItemData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(baseURL, newItemData);
      setItems(prev => [...prev, data]);
      if (refreshFn) await refreshFn();
    } catch (err) {
      console.error("Erro ao criar item:", err);
      setError(err?.response?.data?.message || "Erro ao criar item!");
    } finally {
      setLoading(false);
    }
  }, [baseURL, refreshFn]);

  // ✏️ Editar item
  const editItem = useCallback(async (id, newData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`${baseURL}/${id}`, newData);
      // Atualiza localmente
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...data } : item))
      );
      if (refreshFn) await refreshFn();
      return data;
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      setError(err?.response?.data?.message || "Erro ao atualizar item");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseURL, refreshFn]);



  return { items, loading, error, addItem, editItem, setItems };
}
