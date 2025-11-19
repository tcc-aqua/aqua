"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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

        image: decoded.image || "",

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
      await api.patch("/admins/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmin((prev) => ({
        ...prev,
        ...data,
      }));

      toast.success("Perfil atualizado!");
      return true;

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error(err?.response?.data?.message || "Erro ao atualizar perfil");
      return false;

    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (file) => {
    if (!file || !token) return;

    const form = new FormData();
    form.append("image", file); 
    try {
      const res = await api.post("/admins/upload-img", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data?.img_url) {
        toast.error("Erro no retorno do servidor");
        return;
      }


      const fullUrl = res.data.img_url.startsWith("http")
        ? res.data.img_url
        : `http://localhost:3333/${res.data.img_url.replace(/^\/+/, "")}`;


      setAdmin((prev) => ({
        ...prev,
        image: fullUrl,
      }));

      toast.success("Foto atualizada!");

    } catch (err) {
      console.error("Erro ao enviar foto:", err);
      toast.error("Erro ao enviar foto");
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
