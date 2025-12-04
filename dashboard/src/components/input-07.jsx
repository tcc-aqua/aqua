"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";

export default function InputWithAdornmentDemo() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/auth/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();


    if (!email.trim() || !password.trim()) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao fazer login");

      if (data.token) {
        if (data.token) {
          Cookies.set("token", data.token, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          toast.success(data.message || "Login bem-sucedido!");
          setTimeout(() => router.push("/dashboard"), 50);
        }

      } else {
        throw new Error("Token não recebido do servidor");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Login mal-sucedido");
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-2">

        <div className="relative flex items-center rounded-full border focus-within:ring-1 focus-within:ring-ring pl-2">
          <MailIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-0 focus-visible:ring-0 shadow-none h-15 rounded-full"
          />
        </div>


        <div className="relative flex items-center rounded-full border focus-within:ring-1 focus-within:ring-ring px-2">
          <LockIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-0 focus-visible:ring-0 shadow-none h-15 rounded-full"
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <Button type="submit" className="w-full rounded-full h-10 mt-5 cursor-pointer">
          Entrar
        </Button>


      </form>
    </>
  );
}
