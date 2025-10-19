"use client";

import { Mail, Check, X, User, Globe, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InputProfile() {
  const telefone = "(11) 91234-5678";
  const telefoneVerificado = false;
  const email = "thiago@example.com";
  const nome = "Thiago";
  const sobrenome = "Silva";
  const role = "Administrador";
  const localizacao = "São Paulo, Brasil";

  const handleChangeEmail = () => {
    const newEmail = prompt("Digite seu novo e-mail:", email);
    if (newEmail) console.log("Novo e-mail:", newEmail);
  };

  return (
    <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
   
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-medium">Nome</p>
            <p className="text-sm text-muted-foreground">
              {nome} {sobrenome}
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <User size={16} /> Editar
          </Button>
        </CardContent>
      </Card>

     
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-medium">Telefone</p>
            <p className="text-sm text-muted-foreground">{telefone}</p>
          </div>
          <div className="flex items-center gap-1">
            {telefoneVerificado ? (
              <>
                <Check className="text-green-500" size={14} />
                <span className="text-xs text-green-600">Verificado</span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={14} />
                <span className="text-xs text-red-600">Não verificado</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-medium">E-mail</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeEmail}
            className="flex items-center gap-2"
          >
            <Mail size={16} /> Alterar
          </Button>
        </CardContent>
      </Card>

  
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="flex justify-between items-center py-2">
          <div>
            <p className="text-sm font-medium">Localização</p>
            <p className="text-sm text-muted-foreground">{localizacao}</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Globe size={16} /> Editar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
