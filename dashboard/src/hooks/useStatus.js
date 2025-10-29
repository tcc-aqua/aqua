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
      const action = selectedItem.user_status === "ativo" ? "inativar" : "ativar";
      const res = await fetch(`${baseURL}/${selectedItem.user_id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.user_status}`);
      toast.success(
        `Item ${selectedItem.user_status === "ativo" ? "inativado" : "ativado"} com sucesso!`
      );
      refreshFn(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedItem(null);
    }
  };

  return { showModal, setShowModal, selectedItem, confirmToggleStatus, toggleStatus };
}
