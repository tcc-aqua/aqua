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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCondominios } from "@/hooks/useCondominios";
import { Plus, Eraser, Check, Building, PlusCircle } from 'lucide-react';
import { api } from "@/lib/api";
import AnimationWrapper from "../Layout/Animation/Animation";

export default function CondominioFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // controle do modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    complemento: "",
    status: "ativo",
  });

  const { addCondominio } = useCondominios([], () => onApply?.());

  // Buscar endereço via CEP
  const buscarCep = async (cep) => {
    if (!cep || cep.length < 8) return;
    try {
      const data = await api.get(`/cep/${cep}`);
      if (!data) {
        toast.error("CEP não encontrado!");
        return;
      }

    setFormData((prev) => ({
  ...prev,
  logradouro: data.logradouro || "",
  bairro: data.bairro || "",
  cidade: data.cidade || data.localidade || "",
  estado: data.estado || data.uf || "",
}));


      toast.success("Endereço preenchido automaticamente!");
    } catch (err) {
      toast.error("Erro ao buscar CEP!");
      console.error(err);
    }
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    const filters = {
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
    };
    if (onApply) onApply(filters);
  };

  // Resetar filtros
  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    if (onApply) onApply({});
  };

const handleCreateCondominio = async (e) => {
  e.preventDefault();
  if (!formData.nome || !formData.cep) {
    toast.error("Preencha o nome e o CEP!");
    return;
  }

  const payload = {
    name: formData.nome,
    cep: formData.cep,
    logradouro: formData.logradouro,
    bairro: formData.bairro,
    cidade: formData.cidade,
    estado: formData.estado,
    numero: formData.numero,
    complemento: formData.complemento,
    status: formData.status,
  };

  try {
    // adiciona no backend
    await addCondominio(payload);

    setIsOpen(false);

 
    setFormData({
      nome: "",
      cep: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      numero: "",
      complemento: "",
      status: "ativo",
    });

    // recarrega a tabela chamando a função onApply sem filtros
    if (onApply) onApply({});
    
    toast.success("Condomínio criado com sucesso!");
  } catch (err) {
    console.error(err);
    toast.error("Erro ao criar condomínio!");
  }
};



  return (
    <>

      <AnimationWrapper delay={0.2}>
        <Card className="container mx-auto p-4 rounded-md shadow-sm mb-6 border-l-5 border-l-accent">
          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1">
                Pesquisar Condomínio
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full h-10 border border-border rounded px-2"
              />
            </div>

  
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
              {/* <Button
                onClick={() => setIsOpen(true)}
                className="h-7 w-full sm:w-auto rounded-md bg-accent/80"
              >
                <Plus /> Adicionar
              </Button> */}

            </div>
          </div>
        </Card>
      </AnimationWrapper>

  <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

    {/* Barra superior colorida */}
    <div className="h-2 w-full rounded-t-md bg-primary" />

    <DialogHeader className="flex items-center space-x-2 pb-2 mt-3">
      <Building className="h-5 w-5 text-primary" />
      <DialogTitle className="text-xl font-bold text-accent">
        Cadastrar Novo Condomínio
      </DialogTitle>
    </DialogHeader>

    <form onSubmit={handleCreateCondominio} className="space-y-4 mt-4 px-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Nome</label>
          <Input
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome do condomínio"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">CEP</label>
          <Input
            value={formData.cep}
            onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
            onBlur={() => buscarCep(formData.cep)}
            placeholder="Digite o CEP"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Número</label>
          <Input
            value={formData.numero}
            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
            placeholder="Nº"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="col-span-2 flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Logradouro</label>
          <Input
            value={formData.logradouro}
            onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
            placeholder="Rua, avenida..."
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Bairro</label>
          <Input
            value={formData.bairro}
            onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
            placeholder="Bairro"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Cidade</label>
          <Input
            value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
            placeholder="Cidade"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Estado</label>
          <Input
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            placeholder="UF"
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-1">Complemento</label>
          <Input
            value={formData.complemento}
            onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
            placeholder="Apartamento, bloco..."
            className="text-foreground border border-border rounded-md focus:border-primary focus:ring focus:ring-primary/20 transition"
          />
        </div>
      </div>

      <DialogFooter className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          className="w-32 border-border text-foreground hover:bg-muted"
          onClick={() => setIsOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Criar Condomínio
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>


    </>
  );
}
