"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Building, X, Check, UserStar, AlertTriangle, Crown, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import CondominioFilter from "../Filters/CondominioFilter";
import AnimationWrapper from "../Layout/Animation/Animation";
import { PaginationDemo } from "../pagination/pagination";
import { Separator } from "../ui/separator";
import ExportarTabela from "../Layout/ExportTable/page";
import { useAtribuirSindico } from "@/hooks/useAtribuirSIndico";
import { Input } from "@/components/ui/input";
import { useCondominios } from "@/hooks/useCondominios";
import { api } from "@/lib/api";
import CriarCondominioButton from "../Inputs/ButtonCondominio/page";

export default function CondominiosDashboard() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condominioStats, setCondominioStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    alertas: 0,
    sensoresAtivos: 0,
  });
  const { fetchCondominios, editCondominio, updateCondominioName } = useCondominios();

  const [showModal, setShowModal] = useState(false);
  const [selectedCondominio, setSelectedCondominio] = useState(null);
  const [filters, setFilters] = useState({});


  const [showSindicoModal, setShowSindicoModal] = useState(false);
  const [sindicoId, setSindicoId] = useState("");
  const [sindicos, setSindicos] = useState([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);


  const [form, setForm] = useState({
    condominio_nome: "",
    cep: "",
    numero: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
  });


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sindicoPage, setSindicoPage] = useState(1);
  const [sindicoLimit] = useState(10);
  const [sindicoTotalPages, setSindicoTotalPages] = useState(1);

  const [loadingSindicos, setLoadingSindicos] = useState(false);
  const API_URL = "http://localhost:3333/api/condominios";
  const { atribuirSindico, loading: atribuindo } = useAtribuirSindico(API_URL);


  const fetchData = async (filters = {}, page = 1, limit = 10) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });


      const [resAll, resAtivos, resInativos, resCount] = await Promise.all([
        fetch(`${API_URL}?${params.toString()}`),
        fetch(`${API_URL}/ativos`),
        fetch(`${API_URL}/inativos`),
        fetch(`${API_URL}/count`),
      ]);

      if (!resAll.ok || !resAtivos.ok || !resInativos.ok || !resCount.ok) {
        throw new Error("Erro ao buscar dados dos condomínios.");
      }

      const [dataAll, dataAtivos, dataInativos, dataCount] = await Promise.all([
        resAll.json(),
        resAtivos.json(),
        resInativos.json(),
        resCount.json(),
      ]);

      const allCondominios = Array.isArray(dataAll)
        ? dataAll
        : dataAll.docs || [];

      const filteredCondominios = allCondominios.filter((c) => {
        const matchesStatus = filters.status
          ? c.condominio_status === filters.status
          : true;
        const matchesNome = filters.nome
          ? c.condominio_nome
            ?.toLowerCase()
            .includes(filters.nome.toLowerCase())
          : true;
        return matchesStatus && matchesNome;
      });

      setCondominios(filteredCondominios);

      const stats = {
        total: dataAll.total ?? 0,
        ativos: dataAtivos.total ?? 0,
        inativos: dataInativos.total ?? 0,
        alertas: filteredCondominios.filter((c) => !c.responsavel_id).length,
      };

      const sensores = filteredCondominios.reduce(
        (acc, c) => {
          const numSensores = Number(c.numero_sensores) || 0;
          acc.totalSensores += numSensores;
          if (c.sensor_status === "ativo") acc.sensoresAtivos += numSensores;
          else if (c.sensor_status === "inativo") acc.sensoresInativos += numSensores;
          else if (c.sensor_status === "alerta") acc.sensoresAlertas += numSensores;

          acc.totalApartamentos += Number(c.numero_apartamentos) || 0;
          return acc;
        },
        {
          totalSensores: 0,
          sensoresAtivos: 0,
          sensoresInativos: 0,
          sensoresAlertas: 0,
          totalApartamentos: 0,
        }
      );

      const totalUsers = dataAll.total ?? allCondominios.length;
      setTotalPages(Math.ceil(totalUsers / limit));


      setCondominioStats({
        ...stats,
        sensoresTotal: sensores.totalSensores,
        sensoresAtivos: sensores.sensoresAtivos,
        sensoresInativos: sensores.sensoresInativos,
        sensoresAlertas: sensores.sensoresAlertas,
        apartamentosTotais: sensores.totalApartamentos,
      });
    } catch (err) {
      console.error("Erro ao buscar dados dos condomínios:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(filters, page, limit);
  }, [page, filters]);

  useEffect(() => {
    if (!showSindicoModal) return;

    const fetchSindicos = async () => {
      try {
        setLoadingSindicos(true);

        const res = await fetch(
          `http://localhost:3333/api/users/sindicos?page=${sindicoPage}&limit=${sindicoLimit}`
        );

        if (!res.ok) throw new Error(`Erro ao buscar síndicos (${res.status})`);

        const data = await res.json();

        const lista = Array.isArray(data.docs)
          ? data.docs.map((s) => ({
            id: s.user_id,
            nome: s.user_name,
          }))
          : [];

        setSindicos(lista);

        // atualiza somente os estados da paginação dos síndicos
        setSindicoTotalPages(data.pages ?? Math.ceil((data.total ?? lista.length) / sindicoLimit));
      } catch (err) {
        toast.error(err.message || "Erro ao buscar síndicos");
      } finally {
        setLoadingSindicos(false);
      }
    };

    fetchSindicos();
  }, [showSindicoModal, sindicoPage, sindicoLimit]);



  const confirmToggleStatus = (condominio) => {
    setSelectedCondominio(condominio);
    setShowModal(true);
  };
  const editItem = (condominio) => {
    setSelected(condominio);
    setForm({
      condominio_nome: condominio.condominio_nome,
      cep: condominio.cep,
      numero: condominio.numero,
      logradouro: condominio.logradouro,
      bairro: condominio.bairro,
      cidade: condominio.cidade,
      estado: condominio.uf,
    });

    setOpen(true);
  };
  const handleSave = async () => {
    if (!selected) return toast.error("Nenhum condomínio selecionado.");

    const id = selected.condominio_id;

    try {
      if (form.condominio_nome !== selected.condominio_nome) {
        await updateCondominioName(id, form.condominio_nome);
        toast.success("Condomínio atualizado!");
        setOpen(false);
        fetchData(filters, page, limit);
        return;
      }


      const body = {
        condominio_nome: form.condominio_nome,
        numero: form.numero,
        logradouro: form.logradouro,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
      };
      if (form.cep && form.cep.trim() !== "" && form.cep !== selected.cep) {
        body.cep = form.cep;
      }

      const res = await api.put(`/condominios/${id}`, body);
      const data = res?.data || res;
      if (data?.error) throw new Error(data.error || "Erro ao atualizar condomínio");

      toast.success("Condomínio atualizado!");
      setOpen(false);
      fetchData(filters, page, limit);
    } catch (err) {
      toast.error(err.message || "Erro ao atualizar condomínio.");
    }
  }



  const handleBuscarCep = async () => {
    if (!form.cep || form.cep.length < 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não encontrado!");
        return;
      }

      setForm(f => ({
        ...f,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      toast.success("CEP encontrado!");
    } catch (err) {
      toast.error("Erro ao buscar CEP");
    }
  };

  const toggleStatus = async () => {
    if (!selectedCondominio) return;
    try {
      const action =
        selectedCondominio.condominio_status.toLowerCase() === "ativo"
          ? "inativar"
          : "ativar";

      const res = await fetch(
        `${API_URL}/${selectedCondominio.condominio_id}/${action}`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error(`Erro ao atualizar: ${res.status}`);

      toast.success(
        `Condomínio ${selectedCondominio.condominio_status.toLowerCase() === "ativo"
          ? "inativado"
          : "ativado"} com sucesso!`
      );
      fetchData(filters, page, limit);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowModal(false);
      setSelectedCondominio(null);
    }
  };


  if (loading) return <Loading />;
  if (error) return <p className="text-destructive">Erro: {error}</p>;

  const cards = [
    {
      title: "Condomínios",
      value: condominioStats.total,
      valueAtivos: { total: condominioStats.ativos },
      icon: Building,
      iconColor: "text-accent",
      borderColor: "border-b-accent",
    },
    {
      title: "Apartamentos ",
      value:
        condominios.reduce((acc, c) => acc + (c.numero_apartamentos || 0), 0) ||
        0,
      valueAtivos2: {
        casas:
          condominios.reduce(
            (acc, c) => acc + (c.apartamentosAtivos || 0),
            0
          ) || 0,
      },
      icon: Check,
      iconColor: "text-orange-300",
      borderColor: "border-b-orange-300",
    },
    {
      title: "Sensores Ativos",
      value: condominioStats.sensoresTotal ?? 0,
      icon: Check,
      iconColor: "text-green-700",
      porcentagem:
        condominioStats.sensoresTotal > 0
          ? (
            (condominioStats.sensoresAtivos /
              condominioStats.sensoresTotal) *
            100
          ).toFixed(0) + "% operacionais"
          : "0% operacionais",
      borderColor: "border-b-green-700",
    },

    {
      title: "Total de Síndicos",
      value:
        condominios.reduce(
          (acc, c) => acc + (c.sindico_nome ? 1 : 0),
          0
        ) ?? 0,
      icon: Crown,
      iconColor: "text-yellow-500",
      subTitle: "Síndicos cadastrados",
      borderColor: "border-b-yellow-500",
    },
  ];

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" richColors />
        <div className="mb-10">
          <CondominioFilter onApply={(filters) => fetchData(filters)} />
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimationWrapper key={card.title} delay={i * 0.2}>
                <Card className={`border-b-4 ${card.borderColor}`}>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl text-foreground">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-between -mt-6">
                    <div className="flex flex-col">
                      <p className="font-bold text-4xl text-foreground">
                        {card.value ?? 0}
                      </p>

                      {card.valueAtivos && (
                        <p className="text-sm mt-1 text-accent ">
                          {card.valueAtivos.total} ativos
                        </p>
                      )}
                      {card.valueAtivos2 && (
                        <p className="text-sm mt-1 text-orange-300">
                          {card.valueAtivos2.casas} ativos
                        </p>
                      )}

                      {card.porcentagem && (
                        <p className="text-sm mt-1 text-green-600">
                          {card.porcentagem}
                        </p>
                      )}

                      {card.subTitle && (
                        <p className="text-sm mt-1 text-yellow-500">
                          {card.subTitle}
                        </p>
                      )}
                    </div>
                    <Icon className={`w-8 h-8 bg-${card.iconColor} ${card.iconColor}`} />
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </section>



        <AnimationWrapper delay={0.3}>
          <div className="flex justify-end items-center mt-10">
            <CriarCondominioButton onApply={() => fetchData(filters, page, limit)} />
          </div>

          <Card className="mx-auto mt-10  hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle>Lista de Condomínios
                <ExportarTabela data={condominios} filtros={filters} fileName="condominios" />
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {condominios.length === 0 ? (
                <p>Nenhum condomínio encontrado.</p>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Condomínio</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Unidades</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Sensores</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase">Síndicos</th>
                      {/* <th className="px-4 py-2 text-left text-xs font-medium uppercase">Alertas</th> */}
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {condominios.map(condominio => (
                      <tr key={condominio.condominio_id} className="hover:bg-muted/10 text-foreground">
                        <td className="px-4 py-2">
                          <div className="flex items-start gap-2">
                            <Building className="w-6 h-6 text-sky-600 mt-7" />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">
                                {condominio.condominio_nome}
                              </span>
                              <span className="text-xs text-foreground/80">
                                {condominio.logradouro}, {condominio.numero} - {condominio.bairro}, {condominio.cidade} / {condominio.uf}
                              </span>
                              <span className="text-[10px] text-foreground/60">
                                CEP: {condominio.cep}
                              </span>
                              <span className="text-[10px] text-chart-1">
                                Código {condominio.condominio_codigo}
                              </span>
                              <span className="text-[10px] text-foreground/60">
                                Criado em{" "}
                                {new Date(condominio.data_criacao).toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className={`text-[10px] font-bold ${condominio.condominio_status === "ativo" ? "text-green-600" : "text-destructive"}`}>
                                {condominio.condominio_status === "ativo" ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-2 text-sm">{condominio.numero_apartamentos}/300
                          <div className="text-[10px] text-foreground/60">Total Apartamentos</div>
                        </td>
                        <td className="px-4 py-2 text-sm">{condominio.numero_sensores}/300
                          <div className="text-[10px] text-foreground/60">Total de Sensores</div>
                        </td>

                        <td className="text-sm font-semibold px-3 py-4">
                          <span
                            className={`
                             inline-flex items-center gap-2 px-2 py-1 rounded-md border 
                              ${condominio.condominio_status === "ativo"
                                ? "text-green-500 border-green-600"
                                : "text-destructive border-red-600"}`}
                          >

                            {condominio.condominio_status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-sm justify-center font-semibold">
                          {condominio.sindico_nome && (
                            <div className="flex flex-col items-center justify-center">
                              <Crown className="w-5 h-5 text-yellow-400 mb-1" />
                              <span className="text-foreground">{condominio.sindico_nome}</span>
                            </div>
                          )}


                        </td>

                        <td className="px-2 py-2 text-sm">
                          <div className="flex justify-center gap-1">

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCondominio(condominio);
                                    setSindicoId(condominio.sindico_id ? String(condominio.sindico_id) : "");
                                    setShowSindicoModal(true);
                                  }}
                                >
                                  <UserStar size={14} className="text-accent" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Atribuir Síndico</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => editItem(condominio)}
                                >
                                  <Pencil className="text-accent" size={14} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar condomínio</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button

                                  size="sm"
                                  variant="ghost"
                                  onClick={() => confirmToggleStatus(condominio)}
                                >
                                  <div className="flex items-center gap-1">
                                    {condominio.condominio_status === "ativo" ? (
                                      <Check className="text-green-500" size={14} />
                                    ) : (
                                      <X className="text-destructive" size={14} />
                                    )}
                                  </div>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {condominio.condominio_status === "ativo"
                                  ? "Inativar condomínio"
                                  : "Ativar condomínio"}
                              </TooltipContent>
                            </Tooltip>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
            <Separator></Separator>
            <PaginationDemo
              currentPage={page}
              totalPages={totalPages}
              onChangePage={(newPage) => setPage(newPage)}
              maxVisible={5}
            />
          </Card>
        </AnimationWrapper>



        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

            <div
              className={`h-2 w-full rounded-t-md ${selectedCondominio?.condominio_status === "ativo"
                ? "bg-red-600"
                : "bg-green-600"
                }`}
            />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <div
                className={`p-4 rounded-full ${selectedCondominio?.condominio_status === "ativo"
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-green-100 dark:bg-green-900"
                  }`}
              >
                <AlertTriangle
                  className={`h-10 w-10 ${selectedCondominio?.condominio_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Confirmação
              </DialogTitle>
            </DialogHeader>

            <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
              <p className="text-lg">
                Deseja realmente{" "}
                <span
                  className={`font-semibold ${selectedCondominio?.condominio_status === "ativo"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                    }`}
                >
                  {selectedCondominio?.condominio_status === "ativo" ? "inativar" : "ativar"}
                </span>{" "}
                o condomínio <strong>{selectedCondominio?.condominio_nome}</strong>?
              </p>
              <div className="bg-muted/40 rounded-xl p-4 border border-border mt-3">
                <p className="text-xs uppercase text-muted-foreground mb-1">Código do condomínio</p>
                <p className="font-semibold">{selectedCondominio?.condominio_codigo ?? "-"}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-4 border border-border">
                <p className="text-xs uppercase text-muted-foreground mb-1">Endereço</p>
                <p className="font-semibold">
                  {`${selectedCondominio?.logradouro}, ${selectedCondominio?.numero} - ${selectedCondominio?.bairro}, ${selectedCondominio?.cidade} / ${selectedCondominio?.uf}`}
                </p>
              </div>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                className={`flex items-center gap-2 px-6 py-3 text-white transition ${selectedCondominio?.condominio_status === "ativo"
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}

                onClick={toggleStatus}
              >
                <Check className="h-5 w-5" />
                {selectedCondominio?.condominio_status === "ativo" ? "Inativar" : "Ativar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Dialog open={showSindicoModal} onOpenChange={setShowSindicoModal}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">


            <div className="h-2 w-full rounded-t-md text-yellow-500" />

            <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
              <Crown className="h-10 w-10 text-yellow-500 " />
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                Atribuir Síndico
              </DialogTitle>
            </DialogHeader>


            <div className="mt-5 space-y-6 px-4 text-sm text-foreground/90">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/40 rounded-xl p-4 border border-border">
                  <p className="text-xs uppercase text-muted-foreground mb-2">Síndico</p>

                  <div className="flex flex-col gap-3">
                    {/* SELECT */}
                    <Select value={sindicoId} onValueChange={setSindicoId}>
                      <SelectTrigger className="w-full bg-background border border-input text-foreground">
                        <SelectValue placeholder="Escolha um síndico" />
                      </SelectTrigger>

                      <SelectContent className="max-h-60">
                        {loadingSindicos ? (
                          <div className="p-3 text-sm">Carregando...</div>
                        ) : sindicos.length > 0 ? (
                          sindicos.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.nome}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            Nenhum síndico encontrado
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {/* PAGINAÇÃO ESTÉTICA */}
                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() => setSindicoPage((p) => Math.max(1, p - 1))}
                        disabled={sindicoPage <= 1 || loadingSindicos}
                        className="px-3 py-1 text-xs rounded-md 
          border border-border bg-background hover:bg-accent
          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      <span className="text-xs text-muted-foreground">
                        Página <strong>{sindicoPage}</strong> de <strong>{sindicoTotalPages || 1}</strong>
                      </span>

                      <button
                        onClick={() => setSindicoPage((p) => Math.min(sindicoTotalPages || p, p + 1))}
                        disabled={sindicoPage >= (sindicoTotalPages || 1) || loadingSindicos}
                        className="px-3 py-1 text-xs rounded-md 
          border border-border bg-background hover:bg-accent
          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Próxima →
                      </button>
                    </div>
                  </div>
                </div>



                <div className="bg-muted/40 rounded-xl p-4 border border-border">
                  <p className="text-xs uppercase text-muted-foreground mb-2">Condomínio</p>
                  <p className="font-semibold text-foreground mt-1">
                    {selectedCondominio?.condominio_nome ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSindicoModal(false);
                  setSindicoId("");
                }}
                className="flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancelar
              </Button>

              <Button
                onClick={async () => {
                  if (!sindicoId || sindicoId === "none" || !selectedCondominio) {
                    toast.warning("Selecione um síndico antes de salvar.");
                    return;
                  }

                  try {
                    const idCondominio = selectedCondominio.condominio_id ?? selectedCondominio.id;
                    const res = await fetch(`http://localhost:3333/api/condominios/${idCondominio}/sindico`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ sindico_id: sindicoId }),
                    });

                    if (!res.ok) throw new Error("Erro ao atribuir síndico");

                    toast.success("Síndico atribuído com sucesso!");
                    setShowSindicoModal(false);
                    setSindicoId("");
                    fetchData(filters, page, limit);
                  } catch (err) {
                    toast.error(err.message);
                  }
                }}
                disabled={atribuindo}
                className="bg-yellow-400 hover:bg-yellow-450 text-white"
              >
                <Check className="h-5 w-5" />
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">

            {/* Barra superior */}
            <div className="h-2 w-full bg-primary rounded-t-md" />

            <DialogHeader className="flex items-center space-x-2 pb-3 mt-3">
              <Pencil className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-bold">Editar Condomínio</DialogTitle>
            </DialogHeader>

            <div className="px-4 mt-4">
              <div className="grid grid-cols-2 gap-4">

                {/* Nome */}
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1">Nome</label>
                  <Input
                    value={form.condominio_nome}
                    onChange={(e) => setForm({ ...form, condominio_nome: e.target.value })}
                    placeholder="Nome do condomínio"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">CEP</label>
                  <Input
                    value={form.cep}
                    onChange={(e) => setForm({ ...form, cep: e.target.value })}
                    onBlur={handleBuscarCep}
                    maxLength={8}
                    placeholder="00000000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Número</label>
                  <Input
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    placeholder="Nº"
                  />
                </div>


                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1">Logradouro</label>
                  <Input
                    value={form.logradouro}
                    onChange={(e) => setForm({ ...form, logradouro: e.target.value })}
                    placeholder="Rua..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Bairro</label>
                  <Input
                    value={form.bairro}
                    onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Cidade</label>
                  <Input
                    value={form.cidade}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">Estado</label>
                  <Input
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    placeholder="UF"
                  />
                </div>

              </div>


              <DialogFooter className="pt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="w-32"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleSave}
                  className="w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </div>

          </DialogContent>
        </Dialog>


      </div >

    </>
  );
}
