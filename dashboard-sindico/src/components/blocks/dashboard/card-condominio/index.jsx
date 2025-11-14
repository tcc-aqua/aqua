import { Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export default function CardCondominioInfo() {
    const condominio = {
        nome: "Residencial Sol Nascente",
        endereco: "Rua das Flores, 120 - Centro - São Paulo/SP",
        apartamentos: 48,
        sindico: "Carlos Henrique"
    };

    return (
        <Card className="hover:border-sky-400 dark:hover:border-sky-900 mb-4">
            <CardHeader>
                <CardTitle className="font-bold text-xl text-foreground flex items-center gap-2">
                    <Building className="w-7 h-7 text-sky-500" />
                    Informações do Condomínio
                </CardTitle>
            </CardHeader>

            {/* AGORA EM COLUNA, TUDO EMBAIXO DO TÍTULO */}
            <CardContent className="flex justify-between items-center">
                <p className="text-foreground text-lg flex flex-col">
                    <span className="font-semibold">Nome</span>
                    <span>
                        {condominio.nome}
                    </span>
                </p>

                <p className="text-foreground flex flex-col">
                    <span className="font-semibold">Endereço</span>
                    <span>
                        {condominio.endereco}
                    </span>
                </p>

                <p className="text-foreground flex flex-col">
                    <span className="font-semibold">Apartamentos</span>
                    <span>
                        {condominio.apartamentos}
                    </span>
                </p>

                <p className="text-foreground flex flex-col">
                    <span className="font-semibold">Síndico</span>
                    <span>
                        {condominio.sindico}
                    </span>
                </p>
            </CardContent>
        </Card>
    );
}
