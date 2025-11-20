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

  const isFormData =
    options.body instanceof FormData ||
    (options.headers && options.headers["Content-Type"] === "multipart/form-data");

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),

    // ❗Só aplica JSON se NÃO for FormData
    ...( !isFormData && { "Content-Type": "application/json" }),

    ...options.headers,
  };

  try {
    const url =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    console.log("API Fetch URL:", url, " | isFormData:", isFormData);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (response.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      return null;
    }

    if (!response.ok) {
      if (data?.message) {
        console.warn("Aviso do backend:", data.message);
        return { error: true, message: data.message };
      }
      return { error: true, message: `Erro ${response.status}` };
    }

    return data;
  } catch (err) {
    console.error("Erro inesperado no apiFetch:", err);
    return { error: true, message: err.message };
  }
}

// Atalhos HTTP
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body, options = {}) =>
    apiFetch(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (path, body) =>
    apiFetch(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path) =>
    apiFetch(path, { method: "DELETE", body: JSON.stringify({}) }),
};
