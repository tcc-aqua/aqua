'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 w-full h-17 z-50 bg-card dark:bg-sidebar border-b border-border dark:border-sidebar-border">
      <div className={`${isMobile ? 'py-3 px-2' : 'p-3'} flex items-center justify-end space-x-3`}>
        
        {!isMobile && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        )}

        <div className="relative">
          <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center">
            <span className="text-foreground font-medium text-sm">JD</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border-2 border-card dark:border-sidebar" title="Online" />
        </div>

        {!isMobile && (
          <div className="min-w-0 ">
            <p className="text-sm font-medium text-foreground truncate">João da Silva</p>
            <p className="text-xs text-muted-foreground truncate">Administrador Sênior</p>
          </div>
        )}
      </div>
    </header>
  );
}
