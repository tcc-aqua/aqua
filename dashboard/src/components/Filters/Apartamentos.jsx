"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "../ui/card";
import { Check, Eraser } from "lucide-react";
import AnimationWrapper from "../Layout/Animation/Animation";

export default function ApartamentoFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sensor, setSensor] = useState("all");

  const handleApplyFilters = () => {
    const filters = {
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      sensor_status: sensor === "all" ? undefined : sensor,
    };
    if (onApply) onApply(filters);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSensor("all");
    if (onApply) onApply({});
  };

  return (
 <AnimationWrapper delay={0.2}>
      <Card className="container mx-auto p-4 rounded-md shadow-sm border-l-5 border-l-accent">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Pesquisa */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1">Pesquisar</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar apartamento..."
              className="w-full h-10 border border-border rounded px-2"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col min-w-[120px]">
            <label className="text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sensor */}
          <div className="flex flex-col min-w-[140px]">
            <label className="text-sm font-medium mb-1">Sensor</label>
            <Select value={sensor} onValueChange={setSensor}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Com Sensor Ativo</SelectItem>
                <SelectItem value="inativo">Sem Sensor / Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

       
       <div className="flex gap-2 mt-2 sm:mt-0">
         <Button
                onClick={handleResetFilters}
                className="h-7 w-full sm:w-auto rounded-md bg-destructive/20 hover:bg-destructive/40 text-destructive "
              >
                <Eraser />
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="h-7 w-full sm:w-auto rounded-md text-accent-foreground bg-accent/60 hover:bg-accent/80"
              >
                <Check ></Check>Aplicar
              </Button>
           
            </div>
        </div>
      </Card>
      </AnimationWrapper>
  );
}
