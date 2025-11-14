'use client'

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Eraser, Check } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function ComunicadosFilter({ onApply, role = "usuario" }) {
    // role pode ser: "admin" ou "usuario"

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const handleApplyFilters = () => {
        onApply?.({ search, status, role });
    };

    const handleResetFilters = () => {
        setSearch("");
        setStatus("all");
        onApply?.({ search: "", status: "all", role });
    };

    return (
        <Card className="container mx-auto p-4 rounded-md shadow-sm mb-6 hover:border-sky-400 dark:hover:border-sky-950">
            <div className="flex flex-wrap gap-4 items-end">

                {/* Campo de busca */}
                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-1">
                        Pesquisar Comunicado
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por título, conteúdo ou ID..."
                        className="w-full h-10 border border-border rounded px-2"
                    />
                </div>

                {/* Status */}
                <div className="flex flex-col min-w-[150px]">
                    <label className="text-sm font-medium mb-1">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full h-10">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="nao_lidos">Não Lidos</SelectItem>
                            <SelectItem value="lidos">Lidos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tipo de visualização (apenas admin) */}
                {role === "admin" && (
                    <div className="flex flex-col min-w-[150px]">
                        <label className="text-sm font-medium mb-1">Modo</label>
                        <Select value={role}>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Administrador" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="usuario">Usuário</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Botões */}
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                        onClick={handleResetFilters}
                        className="h-7 w-full sm:w-auto rounded-md bg-destructive/20 hover:bg-destructive/40 text-destructive"
                    >
                        <Eraser />
                    </Button>

                    <Button
                        onClick={handleApplyFilters}
                        className="h-7 w-full sm:w-auto rounded-md text-accent-foreground bg-accent/60 hover:bg-accent/80"
                    >
                        <Check /> Aplicar
                    </Button>
                </div>

            </div>
        </Card>
    );
}
