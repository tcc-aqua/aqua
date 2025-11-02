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
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao fazer login");

      if (data.accessToken) {
        Cookies.set("token", data.accessToken, { expires: 1, secure: true, sameSite: "strict" });
        toast.success("Login bem-sucedido!"); 
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Login mal-sucedido"); 
    }
  };

  return (
    <>
     
      <Toaster position="top-right" richColors />

      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-2">
        {/* Email */}
        <div className="relative flex items-center rounded-full border focus-within:ring-1 focus-within:ring-ring pl-2">
          <MailIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-0 focus-visible:ring-0 shadow-none h-15 rounded-full"
          />
        </div>

        <div className="relative flex items-center rounded-full border focus-within:ring-1 focus-within:ring-ring px-2">
          <LockIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <Button type="submit" className="w-full rounded-full h-10 mt-5">
          Entrar
        </Button>

        <a
          href="/login"
          className="text-[#0372c6] underline hover:text-blue-900 flex justify-center"
        >
          Esqueci minha senha
        </a>
      </form>
    </>
  );
}
