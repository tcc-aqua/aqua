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

export default function UserFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [funcao, setFuncao] = useState("all");

  const handleApplyFilters = () => {
    const filters = {
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      role: funcao === "all" ? undefined : funcao, // envia role corretamente
    };
    if (onApply) onApply(filters);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setFuncao("all");
    if (onApply) onApply({}); // limpa filtros
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
      <Card className="container mx-auto p-4 rounded-md shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
  {/* Pesquisa (maior) */}
  <div className="flex flex-col col-span-1 sm:col-span-2">
    <label className="text-sm font-medium mb-1">Pesquisar</label>
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Pesquisar usuário..."
      className="w-full h-9 border border-border rounded px-2"
    />
  </div>

  {/* Status (menor) */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Status</label>
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-full h-9">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="ativo">Ativo</SelectItem>
        <SelectItem value="inativo">Inativo</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Função (menor) */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Função</label>
    <Select value={funcao} onValueChange={setFuncao}>
      <SelectTrigger className="w-full h-9">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="sindico">Síndico</SelectItem>
        <SelectItem value="morador">Morador</SelectItem>
      </SelectContent>
    </Select>

    
  </div>

  {/* Botões */}
  <div className="flex gap-2 justify-end w-full mt-2 lg:mt-0">
    <Button variant="destructive" onClick={handleResetFilters} className="h-9 w-full lg:w-auto">
      Limpar
    </Button>
    <Button onClick={handleApplyFilters} className="h-9 w-full lg:w-auto">
      Aplicar
    </Button>
  </div>
</div>

      </Card>
    </motion.div>
  );
}
