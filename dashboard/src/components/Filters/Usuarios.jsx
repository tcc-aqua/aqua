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

export default function ContractorsFilter() {
  const [status, setStatus] = useState("all");
  const [contratante, setContratante] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tipoContrato, setTipoContrato] = useState("all");

  const handleApplyFilters = () => {
    console.log({
      status: status === "all" ? "" : status,
      contratante,
      startDate,
      endDate,
      tipoContrato: tipoContrato === "all" ? "" : tipoContrato,
    });
  };

  const handleResetFilters = () => {
    setStatus("all");
    setContratante("");
    setStartDate("");
    setEndDate("");
    setTipoContrato("all");
  };

  const cardVariants = {
    hidden: { y: -120, opacity: 0, zIndex: -1 },
    visible: (delay = 0) => ({
        y: 0,
        opacity: 1,
        zIndex: 10,
        transition: { duration: 0.8, ease: "easeOut", delay },
    }),
}

  return (
      <motion.div
             variants={cardVariants}
             initial="hidden"
             animate="visible"
             custom={0.5}
           >
    <Card className="container mx-auto p-4 rounded-md shadow-sm">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">

        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

  
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">Contratante</label>
          <input
            type="text"
            placeholder="Nome ou ID"
            value={contratante}
            onChange={(e) => setContratante(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm h-9 focus:ring-2 focus:ring-primary focus:outline-none w-full"
          />
        </div>

    
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">Data Início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm h-9 focus:ring-2 focus:ring-primary focus:outline-none w-full"
          />
        </div>

   
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">Data Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm h-9 focus:ring-2 focus:ring-primary focus:outline-none w-full"
          />
        </div>

      
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium mb-1">Tipo</label>
          <Select value={tipoContrato} onValueChange={setTipoContrato}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="clt">CLT</SelectItem>
              <SelectItem value="pj">PJ</SelectItem>
              <SelectItem value="temporario">Temporário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        
        <div className="flex gap-2 justify-end w-full mt-2 lg:mt-0">
          <Button
            variant="destructive"
            onClick={handleResetFilters}
            className="h-9 w-full lg:w-auto"
          >
            Limpar
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="h-9 w-full lg:w-auto"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}
