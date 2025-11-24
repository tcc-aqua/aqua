import { useState } from "react";
import { toast } from "sonner";

export default function useToggleConfirm(baseURL, refreshFn) {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const confirmToggleStatus = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    
  };

  const toggleStatus = async () => {
    if (!selectedItem) return;

    try {
      
      const idField =
        selectedItem.id ||
        selectedItem.user_id ||
        selectedItem.casa_id ||
        selectedItem.apartamento_id ||
        selectedItem.condominio_id ||  
        selectedItem.sensor_id;


      if (!idField) {
        toast.error("Não foi possível identificar o ID do item.");
        return;
      }

      const statusField =
        selectedItem.status ||
        selectedItem.user_status ||
        selectedItem.casa_status ||
        selectedItem.apartamento_status ||
        selectedItem.condominio_status ||
        selectedItem.sensor_status;

      const status = (statusField || "").toLowerCase();

      const action = status === "ativo" ? "inativar" : "ativar";

      const res = await fetch(`${baseURL}/${idField}/${action}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);

      toast.success(
        `Item ${status === "ativo" ? "inativado" : "ativado"} com sucesso!`
      );

      await refreshFn?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  return {
    showModal,
    setShowModal,
    selectedItem,
    confirmToggleStatus,
    toggleStatus,
  };
}
