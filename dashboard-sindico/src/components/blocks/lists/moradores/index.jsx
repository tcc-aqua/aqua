'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Home, Building, Crown, Check, X, Loader2 } from "lucide-react";
import { PaginationDemo } from "@/components/pagination";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "@/lib/api";

const getResidenciaAddress = (user) => {
    if (user.user_type === "condominio") {
        return `Bloco ${user.bloco || user.logradouro || 'N/A'}, ${user.numero || 'N/A'}`;
    }
    return `${user.logradouro || 'N/A'}, ${user.numero || 'N/A'}`;
};

const getResidenciaItem = (user) => {
    if (user.user_type === "condominio") {
        return `Bloco ${user.bloco || user.logradouro || 'N/A'}, Apto ${user.numero || 'N/A'}`;
    }
    return `${user.logradouro || 'N/A'}, N° ${user.numero || 'N/A'}`;
};

const getFullAddress = (user) => {
    return `${user.bairro || 'N/A'}, ${user.cidade || 'N/A'} / ${user.uf || 'N/A'}, CEP: ${user.cep || 'N/A'}`;
};


export default function UsersTableOnly() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const path = `/moradores?page=${currentPage}&limit=${limit}`;
                const response = await api.get(path);

                const usersData = response.data?.users || response?.users;

                if (!usersData) {
                    setError("Não foi possível obter os usuários.");
                    setUsers([]);
                    setTotalPages(1);
                    return;
                }

                setUsers(usersData.docs || []);
                setTotalPages(usersData.pages || 1);

            } catch (err) {
                console.error("Erro na busca de usuários:", err);
                setError("Falha ao se comunicar com o servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage]);



    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const exportCSV = () => {
        const headers = ["Nome", "Email", "CPF", "Residência", "Tipo", "Função", "Status", "Endereço completo"];
        const rows = users.map(u => [
            u.user_name,
            u.user_email,
            u.user_cpf,
            getResidenciaItem(u),
            u.user_type,
            u.user_role,
            u.user_status,
            getFullAddress(u)
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "usuarios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        const tableColumn = ["Nome", "Email", "CPF", "Residência", "Tipo", "Função", "Status", "Endereço completo"];
        const tableRows = users.map(u => [
            u.user_name,
            u.user_email,
            u.user_cpf,
            getResidenciaItem(u),
            u.user_type,
            u.user_role,
            u.user_status,
            getFullAddress(u)
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: "grid",
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 10 },
        });

        doc.save("usuarios.pdf");
    };

    return (
        <Card className="mx-auto mt-10 hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Lista de Usuários</CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={exportCSV} disabled={loading || users.length === 0}>
                        Exportar CSV
                    </Button>
                    <Button size="sm" variant="secondary" onClick={exportPDF} disabled={loading || users.length === 0}>
                        Exportar PDF
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <p>Carregando usuários...</p>
                    </div>
                ) : error ? (
                    <p className="p-4 text-destructive">❌ Erro ao carregar dados: {error}</p>
                ) : users.length === 0 ? (
                    <p className="p-4">Nenhum usuário encontrado.</p>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Usuário</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tipo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Função</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium uppercase">Ações</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {users.map((user) => (
                                    <tr key={user.user_id} className="hover:bg-muted/10 text-foreground">
                                        <td className="px-4 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{user.user_name}</span>
                                                <span className="text-xs text-foreground/80">{user.user_email}</span>
                                                <span className="text-xs text-foreground/60">{user.user_cpf}</span>
                                                <span className={`text-[10px] font-bold ${user.user_status === "ativo" ? "text-green-600" : "text-destructive"}`}>
                                                    {user.user_status === "ativo" ? "Ativo" : "Inativo"}
                                                </span>
                                            </div>
                                        </td>



                                        <td className="text-sm">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white font-semibold uppercase ${user.user_type === "casa" ? "bg-sky-700" : "bg-purple-400"}`}>
                                                {user.user_type === "casa" ? <><Home className="w-4 h-4" /> Casa</> : <><Building className="w-4 h-4" /> Condomínio</>}
                                            </span>
                                        </td>

                                        <td className="text-sm">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-white font-semibold uppercase ${user.user_role === "morador" ? "bg-sky-500" : "bg-yellow-400 text-black"}`}>
                                                {user.user_role === "morador" ? <><User className="w-4 h-4" /> Morador</> : <><Crown className="w-4 h-4" /> Síndico</>}
                                            </span>
                                        </td>

                                        <td className="text-sm font-bold px-9 py-4">
                                            <span className={`inline-block w-3 h-3 rounded-full ${user.user_status === "ativo" ? "bg-green-600" : "bg-destructive"}`} />
                                        </td>

                                        <td className="px-4 py-2 text-sm text-center">
                                            <Button size="sm" variant="ghost">
                                                {user.user_status === "ativo" ? <Check className="text-green-500" size={14} /> : <X className="text-destructive" size={14} />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <PaginationDemo
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </>
                )}
            </CardContent>
        </Card>
    );
}