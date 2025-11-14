"use client";

import Image from "next/image";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimationWrapper from "@/components/Layout/Animation/Animation";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 overflow-hidden">


      <AnimationWrapper />


      <div className="z-10 flex flex-col items-center text-center px-6 max-w-lg">
        
        <AnimationWrapper delay={0.1}>
         
          <div className="w-74 h-74 mb-6 relative">
            <Image
              src="/pingoTriste.png" 
              alt="Página não encontrada"
              fill
              className="object-contain "
            />
          </div>
        </AnimationWrapper>

        <AnimationWrapper delay={0.2}>
          <h1 className="text-6xl font-extrabold mb-3 text-red-600 drop-shadow-lg">
            404
          </h1>
        </AnimationWrapper>

        <AnimationWrapper delay={0.3}>
          <p className="text-gray-700 mb-8 text-lg drop-shadow-sm">
            Ops! A página que você está procurando não existe.<br />
            Verifique o link ou volte para a página inicial.
          </p>
        </AnimationWrapper>

        <AnimationWrapper delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 shadow-md transition-all duration-300 hover:scale-105">
                <Home className="w-5 h-5" />
                Início
              </Button>
            </Link>

            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl px-6 py-3 shadow-md transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar novamente
            </Button>
          </div>
        </AnimationWrapper>
      </div>


      <div className="absolute bottom-6 text-sm text-gray-500 z-10">
        © {new Date().getFullYear()} Aqua - Todos os direitos reservados
      </div>
    </div>
  );
}
