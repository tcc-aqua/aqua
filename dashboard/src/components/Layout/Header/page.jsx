'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { ModeToggle } from '../DarkMode/page';

const headerInfos = [
  {
    nome: "Thiago",
    sobrenome: "Henrique",
    image: "./perfilImage/default-avatar.png",
  },
];

export default function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const getTituloByPath = () => {
    if (pathname.startsWith('/dashboard')) return 'Painel Administrativo';
    if (pathname.startsWith('/users')) return 'Gerenciamento de Usuários';
    if (pathname.startsWith('/condominios')) return 'Gerenciamento de Condomínios';
    if (pathname.startsWith('/suporte')) return 'Central de Suporte';
    if (pathname.startsWith('/settings')) return 'Configurações do Sistema';
    if (pathname.startsWith('/apartamentos')) return 'Gerenciamento de Apartamentos';
    if (pathname.startsWith('/alerts')) return 'Gerenciamento de Alertas';
    if (pathname.startsWith('/casas')) return 'Gerenciamento de Casas';
    if (pathname.startsWith('/sensors')) return 'Gerenciamento de Sensores';
      if (pathname.startsWith('/profile')) return 'Perfil';
    return 'Bem-vindo(a)';
  };

  const titulo = getTituloByPath();

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-card/90 backdrop-blur-lg border-b border-border shadow-sm transition-all">
      <div
        className={`${
          isMobile ? 'px-4 py-3' : 'px-10 py-4'
        } flex items-center justify-between`}
      >
      
        {!isMobile && (
          <div className="absolute left-1/2 -translate-x-1/2 text-center select-none">
            <h1 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
              {titulo}
            </h1>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Sistema de gestão e monitoramento
            </p>
          </div>
        )}

     
        <div className="flex items-center space-x-6 ml-auto">
          <ModeToggle />

          <div className="relative">
            <Bell className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
          </div>

          {headerInfos.map((header, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 border-l border-border pl-5"
            >
              <div className="relative">
                {header.image ? (
                  <img
                    src={header.image}
                    alt={`${header.nome} ${header.sobrenome}`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border">
                    <span className="text-foreground font-semibold text-base">
                      {header.nome[0]}
                      {header.sobrenome[0]}
                    </span>
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
                  title="Online"
                />
              </div>

              {!isMobile && (
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">
                    {header.nome} {header.sobrenome}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Administrador
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
