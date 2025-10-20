"use client";

import { Building, User, Globe, Clock, Phone } from "lucide-react";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

export default function InputEmpresaSettings() {
    const nomeEmpresa = "AquaFlow Controle de Água";
    const cnpj = "12.345.678/0001-90";
    const endereco = "Rua das Águas, 123, São Paulo, SP";
    const logoUrl = "https://via.placeholder.com/100x50?text=AquaFlow";
    const idioma = "Português (Brasil)";
    const timezone = "GMT-3 (Brasília)";

    const handleChangeLogo = () => {
        const newLogo = prompt("Digite a URL do novo logo:", logoUrl);
        if (newLogo) {
            console.log("Nova URL do logo:", newLogo);
        }
    };

    return (
        <div className="mx-auto max-w-lg space-y-4">
            <Card className="shadow-sm">

                <CardContent>




                    Informações da Empresa




                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Nome da Empresa</p>
                            <input
                                type="text"
                                defaultValue={nomeEmpresa}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                        <Button variant="outline" size="sm">
                            <Building size={16} />
                            Alterar
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium">CNPJ</p>
                            <input
                                type="text"
                                defaultValue={cnpj}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>


                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Endereço</p>
                            <input
                                type="text"
                                defaultValue={endereco}
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>



                    Preferências


                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Idioma</p>
                            <p className="text-sm text-muted-foreground">{idioma}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Globe size={16} />
                            Alterar
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Fuso horário</p>
                            <p className="text-sm text-muted-foreground">{timezone}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Clock size={16} />
                            Alterar
                        </Button>
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}
