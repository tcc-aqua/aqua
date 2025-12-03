"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Search, User, ArrowBigRight, Clock, ListFilter, Hash, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AnimationWrapper from "../Layout/Animation/Animation";
import ExportarTabela from "../Layout/ExportTable/page";

export default function LogsDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getValorColor = (valor) => {
    if (!valor) return "text-muted-foreground";

    const v = valor.toString().toLowerCase();

    if (v === "morador") return "text-sky-500 font-semibold";
    if (v === "sindico") return "text-yellow-500 font-semibold";

    if (v === "ativo") return "text-green-500 font-semibold";
    if (v === "inativo") return "text-red-500 font-semibold";

    return "text-muted-foreground font-semibold";
  };


  const [filters, setFilters] = useState({
    search: "",
    userId: "",
    campo: "",
    valor: "",
  });

  const API_URL = "http://localhost:3333/api/logs";

  const getTokenHeader = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Token não encontrado.");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };


  const fetchAll = async () => {
    try {
      setLoading(true);
      const headers = getTokenHeader();
      if (!headers) return;

      const res = await fetch(`${API_URL}/`, { headers });
      const data = await res.json();

      setLogs(data.docs || data.logs || []);
    } catch {
      toast.error("Erro ao carregar logs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentes = async () => {
    try {
      setLoading(true);
      const headers = getTokenHeader();
      if (!headers) return;

      const res = await fetch(`${API_URL}/recentes`, { headers });
      const data = await res.json();

      setLogs(data || []);
    } catch {
      toast.error("Erro ao buscar logs recentes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByUser = async () => {
    if (!filters.userId.trim()) {
      toast.error("Informe um ID de usuário.");
      return;
    }

    try {
      setLoading(true);
      const headers = getTokenHeader();
      if (!headers) return;

      const res = await fetch(`${API_URL}/usuario/${filters.userId}`, { headers });
      const data = await res.json();

      setLogs(data.docs || data.logs || []);
    } catch {
      toast.error("Erro ao buscar logs do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async () => {
    if (!filters.campo.trim() || !filters.valor.trim()) {
      toast.error("Informe campo e valor para busca.");
      return;
    }

    try {
      setLoading(true);
      const headers = getTokenHeader();
      if (!headers) return;

      const url = `${API_URL}/search?campo=${filters.campo}&valor=${filters.valor}`;
      const res = await fetch(url, { headers });
      const data = await res.json();

      setLogs(data.docs || data.logs || []);
    } catch {
      toast.error("Erro ao buscar logs filtrados.");
    } finally {
      setLoading(false);
    }
  };

  const buscarInteligente = async () => {
    if (filters.search.trim() === "") {
      fetchAll();
      return;
    }

    try {
      setLoading(true);
      const headers = getTokenHeader();
      if (!headers) return;

      const url = `${API_URL}/search?campo=campo&valor=${filters.search}`;
      const res = await fetch(url, { headers });
      const data = await res.json();

      setLogs(data.docs || data.logs || []);
    } catch {
      toast.error("Erro ao realizar busca.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pb-16">
      <Toaster richColors position="top-right" />

      <AnimationWrapper>
        <Card className="mt-10 border border-border shadow-lg bg-card backdrop-blur-sm">

          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                Logs do Sistema
              </CardTitle>

              <ExportarTabela data={logs} fileName="logs" />
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <input
                  className="w-full pl-11 pr-3 py-2 rounded-md border border-border bg-background text-foreground 
                             focus:ring-1 focus:ring-primary focus:border-primary transition"
                  placeholder="Buscar logs..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <Button className="h-[42px]" onClick={buscarInteligente}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>


            <div className="flex flex-wrap items-center gap-3 mt-1">


              <Button variant="secondary" onClick={fetchRecentes} className="flex gap-1">
                <Clock className="w-4 h-4" />
                Recentes
              </Button>

              <Button variant="secondary" onClick={fetchAll} className="flex gap-1">
                <ListFilter className="w-4 h-4" />
                Todos
              </Button>
            </div>

          </CardHeader>

          <CardContent>
            {logs.length === 0 ? (
              <p className="text-muted-foreground">Nenhum log encontrado.</p>
            ) : (
              <div className="mt-6 space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className=" w-full p-3 rounded-md border border-border bg-card  hover:bg-muted/10 transition shadow-sm flex items-center justify-between flex-wrap gap-4 text-sm "
                  >

                    <div className="flex items-center gap-4 flex-wrap">

                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-primary/70" />
                        <span className="font-medium text-foreground">
                          {log.alterado_por || "Sistema"}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                         ${log.acao === "create"
                            ? "bg-green-600/20 text-green-500 border border-green-700/40"
                            : log.acao === "update"
                              ? "bg-yellow-600/20 text-yellow-500 border border-yellow-700/40"
                              : "bg-red-600/20 text-red-500 border border-red-700/40"} `}
                      >
                        {log.acao}
                      </span>


                      <div className="flex items-center gap-2 flex-nowrap">


                        {log.campo && (
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold border border-primary/30">
                            {log.campo}
                          </span>
                        )}


                        {log.acao.trim().toLowerCase() === "create" ? (
                          <span
                            className={`px-2 py-1 rounded-md font-semibold border ${getValorColor(
                              log.valor_novo
                            )}`}
                          >
                            {log.valor_novo}
                          </span>
                        ) : (
                          <>

                            <span
                              className={`px-2 py-1 rounded-md border ${getValorColor(
                                log.valor_antigo
                              )}`}
                            >
                              {log.valor_antigo || "null"}
                            </span>

                            <ArrowBigRight className="w-4 h-4 text-primary/70" />


                            <span
                              className={`px-2 py-1 rounded-md font-semibold border ${getValorColor(
                                log.valor_novo
                              )}`}
                            >
                              {log.valor_novo}
                            </span>
                          </>
                        )}
                      </div>
                    </div>


                    <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap font-semibold">
                      <Calendar className="h-4 w-4" />
                      {new Date(log.alterado_em).toLocaleString("pt-BR")}
                    </div>


                  </div>
                ))}
              </div>
            )}
          </CardContent>

        </Card>
      </AnimationWrapper>
    </div>
  );
}
