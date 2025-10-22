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

  return (
    <section className="container mx-auto p-4 bg-card rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtros de Contratos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

   
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
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

   
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Contratante</label>
          <input
            type="text"
            placeholder="Nome ou ID"
            value={contratante}
            onChange={(e) => setContratante(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

     
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Data Início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

     
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Data Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>


        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Tipo</label>
          <Select value={tipoContrato} onValueChange={setTipoContrato}>
            <SelectTrigger>
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

      </div>


      <div className="flex gap-2 mt-4">
        <Button variant="destructive" onClick={handleResetFilters}>
          Limpar Filtros
        </Button>
        <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
      </div>
    </section>
  );
}
