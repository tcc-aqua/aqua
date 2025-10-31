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

          {/* Botões */}
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              variant="destructive"
              onClick={handleResetFilters}
              className="h-10 w-full sm:w-auto"
            >
              Limpar
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="h-10 w-full sm:w-auto bg-accent/70"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
