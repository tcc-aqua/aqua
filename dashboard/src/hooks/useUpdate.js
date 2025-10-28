import { useState } from "react";

export default function useCreateUpdate(baseURL, refreshFn) {
  const [loading, setLoading] = useState(false);

  const createItem = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar item");
      await refreshFn();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, data) => {
    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar item");
      await refreshFn();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { createItem, updateItem, loading };
}
