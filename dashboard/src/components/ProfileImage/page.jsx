"use client";

import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function FotoPerfil() {
  const [foto, setFoto] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

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
    <div className="flex flex-col items-center mt-6 space-y-4 relative">
      <div className="relative">
     
        <img
          src={foto}
          alt="Foto de perfil"
          className="w-32 h-32 object-cover rounded-full border-2"
        />

        {/* Lápis com dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute -mt-8 ml-21 bg-muted text-secondary p-2 rounded-full shadow hover:bg-accent hover:text-white">
              <Pencil size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-22">
            <DropdownMenuItem
              onClick={() => window.open(foto, "_blank")}
            >
              Ver foto
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => fileInputRef.current.click()}
            >
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
