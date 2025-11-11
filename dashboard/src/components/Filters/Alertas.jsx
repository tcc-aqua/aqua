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
import { motion } from "framer-motion";
import { Check, Eraser } from "lucide-react";

export default function AlertasFilter({ onApply }) {
  const [tipo, setTipo] = useState("all");
  const [nivel, setNivel] = useState("all");
  const [status, setStatus] = useState("all");
  const [residencia, setResidencia] = useState("all");

  const handleApplyFilters = () => {
    const filters = {
      tipo: tipo === "all" ? undefined : tipo,
      nivel: nivel === "all" ? undefined : nivel,
      status: status === "all" ? undefined : status,
      residencia: residencia === "all" ? undefined : residencia,
    };
    if (onApply) onApply(filters);
  };

  const handleResetFilters = () => {
    setTipo("all");
    setNivel("all");
    setStatus("all");
    setResidencia("all");
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
      custom={0.3}
    >
      <Card className="container mx-auto p-5 rounded-md shadow-sm mb-6 hover:border-sky-400 dark:hover:border-sky-700 transition-all">
        <div className="flex flex-wrap items-end gap-4">
   
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium mb-1">Tipo</label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full h-11 text-base">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="vazamento">Vazamento</SelectItem>
                <SelectItem value="consumo_alto">Consumo Alto</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium mb-1">Nível</label>
            <Select value={nivel} onValueChange={setNivel}>
              <SelectTrigger className="w-full h-11 text-base">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="baixo">Baixo</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-11 text-base">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativos">Ativos</SelectItem>
                <SelectItem value="resolvidos">Resolvidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-sm font-medium mb-1">Tipo de Residência</label>
            <Select value={residencia} onValueChange={setResidencia}>
              <SelectTrigger className="w-full h-11 text-base">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

    
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              onClick={handleResetFilters}
              className="h-7 w-full sm:w-auto rounded-md bg-destructive/20 hover:bg-destructive/40 text-destructive"
            >
              <Eraser className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="h-7 w-full sm:w-auto rounded-md text-accent-foreground bg-accent/60 hover:bg-accent/80"
            >
              <Check className="mr-1 w-4 h-4" /> Aplicar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
