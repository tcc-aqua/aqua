'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Search, Bell } from 'lucide-react';

const headerInfos = [
  {
    nome: "Thiago",
    sobrenome: "Henrique",
    image: "./perfilImage/default-avatar.png",
    cargo: "Adm é Top",
  },
];

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-card dark:bg-sidebar border-b border-border dark:border-sidebar-border">
      <div
        className={`${isMobile ? 'py-3 px-2' : 'p-3'
          } flex items-center justify-end relative space-x-3`}>


        <div className="flex items-center space-x-5 ml-auto">
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
                  <p className="text-xs text-muted-foreground truncate">
                    {header.cargo}
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
