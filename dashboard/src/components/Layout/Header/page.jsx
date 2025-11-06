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
    if (pathname.startsWith('/condominios')) return 'Gerenciamento de Vagas';
    if (pathname.startsWith('/suporte')) return 'Central de Suporte';
    if (pathname.startsWith('/settings')) return 'Configurações do Sistema';
     if (pathname.startsWith('/apartamentos')) return 'Configurações do Sistema';
      if (pathname.startsWith('/alerts')) return 'Configurações do Sistema';
    return 'Bem-vindo(a)';
  };

  const titulo = getTituloByPath();

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-card dark:bg-sidebar border-b border-border dark:border-sidebar-border">
      <div
        className={`${isMobile ? 'py-3 px-2' : 'p-3'
          } flex items-center justify-between relative`}
      >

       
        {!isMobile && (
          <h1 className="text-lg font-semibold text-foreground ml-6">
            {titulo}
          </h1>
        )}

      
        <div className="flex items-center space-x-6 px-3 py-3">
          <ModeToggle />
          <Bell className="h-4 w-4 text-muted-foreground cursor-pointer" />

          {headerInfos.map((header, index) => (
            <div key={index} className="flex items-center space-x-2 mr-4">
              <div className="relative">
                {header.image ? (
                  <img
                    src={header.image}
                    alt={`${header.nome} ${header.sobrenome}`}
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-foreground font-medium text-sm">
                      {header.nome[0]}
                      {header.sobrenome[0]}
                    </span>
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border-2 border-card dark:border-sidebar"
                  title="Online"
                />
              </div>

              {!isMobile && (
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {header.nome} {header.sobrenome}
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
