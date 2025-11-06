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

export default function MensagensSuporteFilter({ onApply }) {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const handleApplyFilters = () => {
        onApply?.({ search, status });
    };

    
    const handleResetFilters = () => {
        setSearch("");
        setStatus("all");
        onApply?.({ search: "", status: "all" });
    };

    return (
        <Card className="container mx-auto p-4 rounded-md shadow-sm mb-6">
            <div className="flex flex-wrap gap-4 items-end">

                <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-1">Pesquisar Mensagem</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome, email ou ID do ticket..."
                        className="w-full h-10 border border-border rounded px-2"
                    />
                </div>

              
                <div className="flex flex-col min-w-[150px]">
                    <label className="text-sm font-medium mb-1">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full h-10">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="respondida">Respondidas</SelectItem>
                            <SelectItem value="nao_respondida">Não Respondidas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                        variant="destructive"
                        onClick={handleResetFilters}
                        className="h-10 w-full sm:w-auto rounded-full"
                    >
                        <Eraser />
                    </Button>

                    <Button
                        onClick={handleApplyFilters}
                        className="h-10 w-full sm:w-auto rounded-full text-green-700 bg-green-200 hover:bg-green-200"
                    >
                        <Check /> Aplicar
                    </Button>
                </div>
            </div>
        </Card>
    );
}
