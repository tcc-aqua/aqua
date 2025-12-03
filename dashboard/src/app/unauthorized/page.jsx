"use client";

import { ShieldAlert, LogIn, Home, RefreshCw, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimationWrapper from "@/components/Layout/Animation/Animation";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-zinc-900 to-black text-white overflow-hidden">

   
      <AnimationWrapper />

  
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <Waves className="w-full h-full text-sky-600 opacity-10" />
      </motion.div>


      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center px-6 text-center max-w-lg"
      >
   
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-20 h-20 text-sky-500 drop-shadow-xl animate-pulse" />
        </div>


        <h1 className="text-4xl font-bold tracking-tight mb-2 text-sky-300 drop-shadow-md">
          Acesso Negado
        </h1>

     
        <p className="text-gray-300 mb-8 leading-relaxed">
          Esta área é protegida e requer permissões específicas.
          <br />
          Entre com sua conta ou retorne à página inicial.
        </p>

   
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/auth/email-login">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105">
              <Home className="w-4 h-4" />
              Início
            </Button>
          </Link>

          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-2 shadow-md transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
        </div>
      </motion.div>

  
      <div className="absolute bottom-6 text-sm text-sky-300/70 z-10">
        © {new Date().getFullYear()} Aqua • Sistema de Monitoramento de Água
      </div>
    </div>
  );
}
