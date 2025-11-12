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
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Eraser } from "lucide-react";

export default function SensorFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [tipoResidencia, setTipoResidencia] = useState("all");

  const handleApplyFilters = () => {
    const filters = {
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      residencia_type: tipoResidencia === "all" ? undefined : tipoResidencia,
    };
    if (onApply) onApply(filters);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setTipoResidencia("all");
    if (onApply) onApply({});
  };

  const cardVariants = {
    hidden: { y: -120, opacity: 0, zIndex: -1 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      zIndex: 10,
      transition: { duration: 0.8, ease: "easeOut", delay },
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={0.5}
    >
      <Card className="container mx-auto p-4 rounded-md shadow-sm mb-6  hover:border-sky-400 dark:hover:border-sky-950">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Pesquisa */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-1">Pesquisar Sensor</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código ou localização..."
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
                <SelectItem value="alerta">Alerta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de residência */}
          <div className="flex flex-col min-w-[140px]">
            <label className="text-sm font-medium mb-1">Tipo de Residência</label>
            <Select value={tipoResidencia} onValueChange={setTipoResidencia}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="condominio">Condomínio</SelectItem>
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
    </motion.div>
  );
}
