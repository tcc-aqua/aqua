"use client";

import { ShieldOff, LogIn, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimationWrapper from "@/components/Layout/Animation/Animation";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white overflow-hidden">
      {/* Fundo animado */}
  <AnimationWrapper/>

      {/* Conteúdo principal */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        <div className="flex justify-center mb-6">
          <ShieldOff className="w-20 h-20 text-red-500 drop-shadow-lg animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-md">
          Acesso Negado
        </h1>

        <p className="text-gray-300 mb-8 max-w-md">
          Você não tem permissão para acessar esta página.
          <br />
          Faça login ou volte para a página inicial.
        </p>

 
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/auth/email-login">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>

          <Link href="/">
            <Button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105">
              <Home className="w-4 h-4" />
              Início
            </Button>
          </Link>

          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-6 text-sm text-gray-400 z-10 opacity-70">
        © {new Date().getFullYear()} AquaMonitor - Todos os direitos reservados
      </div>
    </div>
  );
}
