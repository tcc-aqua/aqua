"use client";

import { useEffect, useState } from "react";
import Loading from "../Layout/Loading/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { FileSpreadsheet, Clock, ListTree, Search, Hash, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AnimationWrapper from "../Layout/Animation/Animation";
import ExportarTabela from "../Layout/ExportTable/page";
import { PaginationDemo } from "../pagination/pagination";

export default function LogsDashboard() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        criados: 0,
        atualizados: 0,
        deletados: 0,
    });

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
    });

    const API_URL = "http://localhost:3333/api/logs";
const fetchLogs = async (page = 1) => {
    try {
        setLoading(true);

  
        const searchActive = filters.search.trim().length > 0;

        const params = new URLSearchParams({
            page,
            limit
        });

        let urlLogs = `${API_URL}`;

        if (searchActive) {
            // backend exige campo e valor → você escolhe buscar por descrição
            params.append("campo", "descricao");
            params.append("valor", filters.search.trim());
            urlLogs = `${API_URL}/search`;
        }

        const [resLogs, resCount, resActions] = await Promise.all([
            fetch(`${urlLogs}?${params.toString()}`),
            fetch(`${API_URL}/count`),
            fetch(`${API_URL}/count/acao`),
        ]);

        const logsData = await resLogs.json();
        const countData = await resCount.json();
        const actionsData = await resActions.json();

        setLogs(logsData.logs || logsData.docs || []);

        setStats({
            total: countData.total ?? 0,
            criados: actionsData.create ?? 0,
            atualizados: actionsData.update ?? 0,
            deletados: actionsData.delete ?? 0,
        });

        setTotalPages(Math.ceil((countData.total ?? 0) / limit));
    } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar logs");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    if (loading) return <Loading />;


    return (
        <div>
            <Toaster richColors position="top-right" />

            <AnimationWrapper delay={0.3}>
                <Card className="mt-10 hover:border-sky-400 dark:hover:border-sky-950">

                    <CardHeader>
                        <CardTitle>
                            Logs do Sistema
                            <ExportarTabela data={logs} fileName="logs" filtros={filters} />
                        </CardTitle>
                        <div className="flex items-center gap-3 mb-8">

                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-500" />

                                <input
                                    className="
        w-full pl-11 pr-3 py-2 rounded-lg border 
        bg-background text-foreground
        focus:ring-2 focus:ring-sky-500 focus:border-sky-500 
        transition-all shadow-sm
      "
                                    placeholder="Filtrar registros (ação, usuário, descrição, ID...)"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>

                            <Button
                                onClick={() => fetchLogs(1)}
                                className="px-4 h-[42px] flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Buscar
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        {logs.length === 0 ? (
                            <p>Nenhum log encontrado.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                            Ação
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                            Usuário
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                            Descrição
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                            Data
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">
                                            ID
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/10 text-foreground">


                                            <td className="px-4 py-2 text-sm font-semibold">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-white uppercase text-xs font-bold
                          ${log.acao === "create" ? "bg-green-600"
                                                            : log.acao === "update" ? "bg-yellow-500"
                                                                : log.acao === "delete" ? "bg-red-600"
                                                                    : "bg-gray-500"
                                                        }`}
                                                >
                                                    {log.acao}
                                                </span>
                                            </td>


                                            <td className="px-4 py-2 text-sm flex gap-2 items-center">
                                                <User className="w-4 h-4 text-sky-600" />
                                                {log.usuario_nome || "Desconhecido"}
                                            </td>


                                            <td className="px-4 py-2 text-sm">{log.descricao}</td>


                                            <td className="px-4 py-2 text-sm">
                                                {new Date(log.data).toLocaleString("pt-BR")}
                                            </td>


                                            <td className="px-4 py-2 text-sm">
                                                <Hash className="inline-block w-4 h-4 mr-1" />
                                                {log.referencia_id}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>

                    <Separator />

                    <PaginationDemo
                        currentPage={page}
                        totalPages={totalPages}
                        onChangePage={(p) => setPage(p)}
                    />
                </Card>
            </AnimationWrapper>
        </div>
    );
}
