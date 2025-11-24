"use client";
import { useEffect, useState } from "react";
import { Building, MapPin, Users, UserSquare2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Separator } from "../../../ui/separator";
import { api } from "@/lib/api";

export default function CardCondominioInfo() {
  const [condominio, setCondominio] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await api.get("/dashboard");

      if (!res || res.error) {
        console.error("Erro ao buscar condomínio:", res);
        return;
      }

      setCondominio(res.condominio);
    }

    loadData();
  }, []);

  if (!condominio)
    return (
      <Card className="p-4">
        <p>Carregando informações do condomínio...</p>
      </Card>
    );

  const endereco = `${condominio.logradouro}, ${condominio.numero} - ${condominio.bairro} - ${condominio.cidade}/${condominio.uf}`;

  return (
    <Card className="mb-6 border-2 border-border dark:border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="pb-3 space-y-2">
        <CardTitle className="flex items-center gap-3 text-2xl font-extrabold text-foreground">
          <Building className="w-8 h-8 text-primary" />
          Informações do Condomínio
        </CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <InfoItem
          icon={<UserSquare2 className="w-5 h-5 text-primary mt-1" />}
          label="Nome do Condomínio"
          value={condominio.name}
          bold
        />

        <InfoItem
          icon={<MapPin className="w-5 h-5 text-primary mt-1" />}
          label="Endereço Completo"
          value={endereco}
        />

        <InfoItem
          icon={<UserSquare2 className="w-5 h-5 text-primary mt-1" />}
          label="Síndico Responsável"
          value={condominio.sindico_id}
        />

        <InfoItem
          icon={<Hash className="w-5 h-5 text-primary mt-1" />}
          label="Código de Acesso"
          value={condominio.codigo_acesso}
          chip
        />

        <InfoItem
          icon={<MapPin className="w-5 h-5 text-primary mt-1" />}
          label="CEP"
          value={condominio.cep}
          chip
        />
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value, bold = false, chip = false, color }) {
  return (
    <div className="flex flex-col gap-1 border-b pb-2 sm:border-b-0 sm:pb-0">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          {chip ? (
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground shadow-inner">
              {value}
            </span>
          ) : (
            <p
              className={`text-base leading-snug ${
                bold ? "font-bold" : "font-medium"
              } ${color ? color : ""}`}
            >
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
