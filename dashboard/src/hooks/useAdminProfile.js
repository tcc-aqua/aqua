"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api"; // Seu wrapper de apiFetch
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function useAdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded || typeof decoded !== "object") {
        console.error("Token inválido");
        setLoading(false);
        return;
      }

      setAdmin({
        id: decoded.id,
        first_name: decoded.first_name || "",
        last_name: decoded.last_name || "",
        phone: decoded.phone || "",
        email: decoded.email || "",
        address: decoded.address || "",
        image: decoded.img_url || "", // <-- AQUI: use img_url se o token tiver esse campo
        role: decoded.role || decoded.type || "admin",
      });

    } catch (err) {
      console.error("Erro ao decodificar token:", err);
    }

    setLoading(false);
  }, [token]);


  const saveProfile = async (data) => {
    if (!token) return false;

    setSaving(true);
    try {
      // Seu backend AdminController.updatePassword usa req.admin.id
      // e seu serviço AdminService.updateMe usa adminId
      // Certifique-se de que /admins/me PATCH é para atualizar o perfil do admin logado
      // e que o middleware autenticarAdmin popula req.admin.id
      const res = await api.patch("/admins/me", data, {
        headers: { Authorization: `Bearer ${token}` }, // Já é tratado pelo apiFetch, mas não custa ter aqui
      });
      
      // apiFetch retorna { error: true, message: "..." } em caso de erro
      if (res && res.error) {
        throw new Error(res.message);
      }

      // Se o backend retorna o admin atualizado, podemos usar isso
      // ou apenas atualizar o estado local se o PATCH tiver sido bem-sucedido.
      if (res && res.id) { // res é o admin atualizado sem a senha
        setAdmin((prev) => ({
          ...prev,
          ...res, // Atualiza com os dados do admin retornado (email, etc.)
          // password não deve ser incluído aqui
        }));
      } else { // Caso o backend não retorne o admin completo, atualiza o que foi enviado
         setAdmin((prev) => ({
          ...prev,
          ...data, // Pode sobrescrever com 'password' se estiver no `data`
          password: "" // Limpar a senha para não armazenar no estado do frontend
        }));
      }

      toast.success("Perfil atualizado!");
      return true;

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      // apiFetch já coloca a mensagem de erro em err.message
      toast.error(err.message || "Erro ao atualizar perfil"); 
      return false;

    } finally {
      setSaving(false);
    }
  };

const uploadPhoto = async (file) => {
  if (!file || !token) return toast.error("Arquivo ou token não encontrados.");

  const form = new FormData();
  form.append("profileImage", file); // ⚡️ correto

  setSaving(true);
  try {
    const res = await api.post("/admins/upload-img", form);

    if (res && res.error) throw new Error(res.message);

    const fullUrl = res.img_url.startsWith("http")
      ? res.img_url
      : `http://localhost:3333${res.img_url}`;

    setAdmin((prev) => ({ ...prev, image: fullUrl }));
    toast.success("Foto atualizada!");
  } catch (err) {
    console.error("Erro ao enviar foto:", err);
    toast.error(err.message || "Erro ao enviar foto");
  } finally {
    setSaving(false);
  }
};

  return {
    admin,
    loading,
    saving,
    saveProfile,
    uploadPhoto,
  };
}