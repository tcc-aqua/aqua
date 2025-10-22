"use client";

import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardTitle } from "@/components/ui/card";

export default function FotoPerfil() {
  const [foto, setFoto] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const nome = "Thiago";
  const sobrenome = '';
  const role = "Adm Super ADM ";

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFoto(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFoto("/default-avatar.png");
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4">
    
      <div className="relative">
        <img
          src={foto}
          alt="Foto de perfil"
          className="h-32 w-32 md:h-40 md:w-40 object-cover rounded-full border-2"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute bottom-2 right-2 bg-muted dark:text-muted-foreground text-secondary p-2 rounded-full shadow hover:bg-accent hover:text-white">
              <Pencil size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={() => window.open(foto, "_blank")}>
              Ver foto
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current.click()}>
              Alterar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRemove}
              className="text-red-500 hover:bg-transparent hover:text-red-500 focus:bg-transparent focus:text-red-500 cursor-pointer"
            >
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className=" items-center -ml-25 md:ml-0 text-center md:text-left md:mt-8">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-semibold whitespace-nowrap">
            {nome} {sobrenome}
          </CardTitle>
          <p className="text-sm text-muted-foreground whitespace-nowrap ">{role}</p>
        </CardHeader>
      </div>

  
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
