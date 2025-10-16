'use client';

import { useIsMobile } from '@/hooks/use-mobile';

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="mx-auto w-full h-17 bg-white fixed z-50">
      <div className={` border-slate-200 ${isMobile ? 'py-3 px-2' : 'p-3'}`}>
        {!isMobile ? (
          <div className="flex items-center justify-end space-x-3 p-2 rounded-md bg-white transition-colors duration-200">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-medium text-sm">JD</span>
            </div>
            <div className="min-w-0 mr-100">
              <p className="text-sm font-medium text-slate-800 truncate">João da Silva</p>
              <p className="text-xs text-slate-500 truncate">Administrador Sênior</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
          </div>
        ) : (
          <div className="flex justify-end">
            <div className="relative">
              <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-700 font-medium text-sm">JD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
