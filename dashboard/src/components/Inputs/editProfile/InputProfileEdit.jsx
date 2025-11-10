"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, User, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../../ui/button";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function FotoPerfil() {
  const [foto, setFoto] = useState("/perfilImage/default-avatar.png");
  const [file, setFile] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: "",
    role: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserInfo({
          email: decoded.email || decoded.user_email || "usuario@dominio.com",
          role: decoded.type || decoded.role || "Usuário",
        });
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setFoto(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFoto("/perfilImage/default-avatar.png");
  };

  const handleChangeEmail = () => {
    const newEmail = prompt("Digite seu novo e-mail:", userInfo.email);
    if (newEmail) console.log("Novo e-mail:", newEmail);
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">

      <div className="relative">
        <img
          src={foto}
          alt="Foto de perfil"
          className="h-32 w-32 md:h-40 md:w-40 object-cover rounded-full border-2 border-border shadow-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute bottom-2 right-2 bg-muted text-secondary dark:text-muted-foreground p-2 rounded-full shadow-md hover:bg-accent hover:text-white transition-colors">
              <Pencil size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={() => window.open(foto, "_blank")}>
              Ver foto
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
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

    
      <div className="flex flex-col justify-center md:justify-start text-center md:text-left w-full max-w-sm md:mt-8">
        <CardHeader className="p-0 ">
          <CardTitle className="text-xl font-semibold uppercase">
            {userInfo.email.split("@")[0] || "Usuário"}
          </CardTitle>
        </CardHeader>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground  rounded-full p-1 h-7">Fução: {userInfo.role}</p>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <User size={16} /> Editar
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground ">Email: {userInfo.email}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeEmail}
            className="flex items-center gap-2"
          >
            <Mail size={16} /> Alterar
          </Button>
        </div>
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
