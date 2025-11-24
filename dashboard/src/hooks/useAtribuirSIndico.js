"use client";
import { useState } from "react";
import { toast } from "sonner";

export function useAtribuirSindico(API_URL) {
  const [loading, setLoading] = useState(false);

  const atribuirSindico = async (condominioId, sindicoId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${condominioId}/sindico`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sindico_id: sindicoId }),
      });

      if (!res.ok) throw new Error("Erro ao atribuir síndico");

      toast.success("Síndico atribuído com sucesso!");
      return true;
    } catch (err) {
    
      console.error(err);
       
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { atribuirSindico, loading };
}
