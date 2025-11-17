import { Building, MapPin, Users, Hash, UserSquare2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

export default function CardCondominioInfo() {
    const condominio = {
        nome: "Residencial Sol Nascente",
        endereco: "Rua das Flores, 120 - Centro - São Paulo/SP",
        apartamentos: 48,
        sindico: "Carlos Henrique",
        codigo: "11102025"
    };

    return (
        <Card className="hover:border-sky-400 dark:hover:border-sky-900 mb-4 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="font-bold text-2xl flex items-center gap-2">
                    <Building className="w-7 h-7 text-sky-500" />
                    Informações do Condomínio
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">

                <div className="flex items-start gap-3">
                    <UserSquare2 className="w-5 h-5 text-sky-500 mt-1" />
                    <div>
                        <p className="text-sm font-semibold opacity-70">Nome</p>
                        <p className="font-medium">{condominio.nome}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sky-500 mt-1" />
                    <div>
                        <p className="text-sm font-semibold opacity-70">Endereço</p>
                        <p className="font-medium">{condominio.endereco}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-sky-500 mt-1" />
                    <div>
                        <p className="text-sm font-semibold opacity-70">Apartamentos</p>
                        <p className="font-medium">{condominio.apartamentos}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <UserSquare2 className="w-5 h-5 text-sky-500 mt-1" />
                    <div>
                        <p className="text-sm font-semibold opacity-70">Síndico</p>
                        <p className="font-medium">{condominio.sindico}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-sky-500 mt-1" />
                    <div>
                        <p className="text-sm font-semibold opacity-70">Código de Acesso</p>
                        <p className="font-medium">{condominio.codigo}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
