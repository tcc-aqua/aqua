// lib/api.js
import { toast } from "sonner";

// Função para pegar token do cookie
export function getTokenFromCookie(ctx) {
  if (ctx && ctx.req) {
    const cookie = ctx.req.headers.cookie || "";
    const match = cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  } else if (typeof window !== "undefined") {
    const match = document.cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  }
  return null;
}

// Função principal de fetch
export async function apiFetch(path, options = {}) {
  const token = getTokenFromCookie();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    // Verifica se path é URL absoluta ou relativa
    const url =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    console.log("API Fetch URL:", url);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    // Tratamento de token expirado
    if (response.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      return null;
    }

    // 
if (!response.ok) {
  if (Array.isArray(data)) {
    
    const messages = data.map((e) => e.message).join(", ");
    console.warn("Erros do backend:", messages);
    return { error: true, message: messages };
  } else if (data?.message) {
    console.warn("Aviso do backend:", data.message);
    return { error: true, message: data.message };
  } else if (data?.errors) {
    console.warn("Erros do backend:", data.errors);
    return { error: true, message: data.errors };
  } else {
    console.warn(`Erro ${response.status}`);
    return { error: true, message: `Erro ${response.status}` };
  }
}

    return data;
  } catch (err) {
    if (!err.handled) {
      console.error("Erro inesperado no apiFetch:", err);
    }
    return { error: true, message: err.message };
  }
}

// Atalhos para métodos HTTP comuns
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) =>
    apiFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    apiFetch(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (path) =>
    apiFetch(path, {
      method: "DELETE",
    }),
};
