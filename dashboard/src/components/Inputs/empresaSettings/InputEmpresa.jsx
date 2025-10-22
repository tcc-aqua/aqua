"use client";

import { useState } from "react";
import { Building, Globe2, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InputEmpresaSettings() {
  const empresa = {
    nome: "Aqua ",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Águas, 123, São Paulo, SP",
    telefone: "(11) 91234-5678",
    email: "contato@aquaflow.com.br",
    site: "https://aqua.com.br",
    idioma: "Português (Brasil)",
    timezone: "GMT-3 (Brasília)",
  };

  const [idioma, setIdioma] = useState(empresa.idioma);
  const [timezone, setTimezone] = useState(empresa.timezone);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto max-w-5xl">

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building size={16} /> Nome da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            defaultValue={empresa.nome}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>


      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            CNPJ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            defaultValue={empresa.cnpj}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>

   
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={16} /> Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            defaultValue={empresa.endereco}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Phone size={16} /> Telefone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            defaultValue={empresa.telefone}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>

   
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Mail size={16} /> E-mail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="email"
            defaultValue={empresa.email}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>

 
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe2 size={16} /> Site da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="url"
            defaultValue={empresa.site}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe2 size={16} /> Idioma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={idioma} onValueChange={setIdioma}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Selecionar idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Português (Brasil)">Português (Brasil)</SelectItem>
              <SelectItem value="Inglês (EUA)">Inglês (EUA)</SelectItem>
              <SelectItem value="Espanhol">Espanhol</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>


      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe2 size={16} /> Fuso Horário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Selecionar fuso horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GMT-3 (Brasília)">GMT-3 (Brasília)</SelectItem>
              <SelectItem value="GMT-5 (Manaus)">GMT-5 (Manaus)</SelectItem>
              <SelectItem value="GMT-4 (Cuiabá)">GMT-4 (Cuiabá)</SelectItem>
              <SelectItem value="GMT-1 (Açores)">GMT-1 (Açores)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

     
      <Card className="shadow-sm md:col-span-4">
        <CardContent className="flex justify-end">
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
