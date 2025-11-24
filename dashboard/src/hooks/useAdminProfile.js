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

      const savedImage = localStorage.getItem("admin_image");

      setAdmin({
        id: decoded.id,
        email: decoded.email || "",
        role: decoded.role || decoded.type || "admin",
        image: savedImage || decoded.img_url || "", // <-- AQUI funciona!
      });

    } catch (err) {
      console.error("Erro ao decodificar token:", err);
    }

    setLoading(false);
  }, [token]);

  
  const uploadPhoto = async (file) => {
    if (!file || !token) return toast.error("Arquivo ou token não encontrados.");

    const form = new FormData();
    form.append("profileImage", file);

    setSaving(true);

    try {
     
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/upload-img`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const fullUrl = data?.img_url?.startsWith("http")
        ? data.img_url
        : `http://localhost:3333${data.img_url}`;

      
      setAdmin((prev) => ({ ...prev, image: fullUrl }));

      localStorage.setItem("admin_image", fullUrl);

      toast.success("Foto atualizada!");
    } catch (err) {
      console.error("Erro ao enviar foto:", err);
      toast.error(err.message || "Erro ao enviar foto");
    } finally {
      setSaving(false);
    }
  };


  const saveProfile = async (data) => {
    if (!token) return false;

    setSaving(true);
    try {
      const res = await api.patch("/admins/me", data);

      if (res?.error) throw new Error(res.message);

      toast.success("Perfil atualizado!");
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    admin,
    loading,
    saving,
    uploadPhoto,
    saveProfile,
  };
}
