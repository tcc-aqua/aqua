import { toast } from "sonner";

// ----------------------------
// PEGAR TOKEN DO COOKIE
// ----------------------------
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

// ----------------------------
// FUNÇÃO PRINCIPAL DE FETCH
// ----------------------------
export async function apiFetch(path, options = {}) {
  const token = getTokenFromCookie();

  let headers = { ...options.headers };

  // ❗ Se o body NÃO for FormData → é JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } else {
    // multipart/form-data → deixa o browser definir o Content-Type
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  try {
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

    // ----------------------------
    // TOKEN EXPIRADO
    // ----------------------------
    if (response.status === 401) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      return null;
    }

    // ----------------------------
    // ERROS
    // ----------------------------
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
    console.error("Erro inesperado no apiFetch:", err);
    return { error: true, message: err.message };
  }
}

// ----------------------------
// ATALHOS HTTP
// ----------------------------
export const api = {
  get: (path) => apiFetch(path),

  post: (path, body, options = {}) =>
    apiFetch(path, { method: "POST", body, ...options }),

  put: (path, body, options = {}) =>
    apiFetch(path, { method: "PUT", body, ...options }),

  patch: (path, body, options = {}) =>
    apiFetch(path, { method: "PATCH", body, ...options }),

  del: (path, options = {}) =>
    apiFetch(path, { method: "DELETE", ...options }),
};
