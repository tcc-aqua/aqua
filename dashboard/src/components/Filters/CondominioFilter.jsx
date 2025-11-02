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
import { Plus, Eraser, Check  } from 'lucide-react';
import { api } from "@/lib/api";

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
        cidade: data.localidade || "",
        estado: data.uf || "",
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
    <>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0.5}
      >
        <Card className="container mx-auto p-4 rounded-md shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Pesquisa */}
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
              <Check ></Check>Aplicar
              </Button>
                            <Button
                onClick={() => setIsOpen(true)}
                className="h-10 w-full sm:w-auto rounded-full"
              >
             <Plus/> Adicionar
              </Button>
         
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modal de criação */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Condomínio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCondominio} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Nome do condomínio"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">CEP</label>
                <Input
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: e.target.value })
                  }
                  onBlur={() => buscarCep(formData.cep)}
                  placeholder="Digite o CEP"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Número</label>
                <Input
                  value={formData.numero}
                  onChange={(e) =>
                    setFormData({ ...formData, numero: e.target.value })
                  }
                  placeholder="Nº"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium mb-1">Logradouro</label>
                <Input
                  value={formData.logradouro}
                  onChange={(e) =>
                    setFormData({ ...formData, logradouro: e.target.value })
                  }
                  placeholder="Rua, avenida..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Bairro</label>
                <Input
                  value={formData.bairro}
                  onChange={(e) =>
                    setFormData({ ...formData, bairro: e.target.value })
                  }
                  placeholder="Bairro"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Cidade</label>
                <Input
                  value={formData.cidade}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade: e.target.value })
                  }
                  placeholder="Cidade"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Estado</label>
                <Input
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  placeholder="UF"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1">Complemento</label>
                <Input
                  value={formData.complemento}
                  onChange={(e) =>
                    setFormData({ ...formData, complemento: e.target.value })
                  }
                  placeholder="Apartamento, bloco..."
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="">
                Criar Condomínio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
