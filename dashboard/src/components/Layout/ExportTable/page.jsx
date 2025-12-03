"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportarTabela({ data = [], fileName = "dados", chartRef = null }) {
    if (!data.length) return null;

    const colunas = Object.keys(data[0]);

    const baixar = (conteudo, nome, tipo) => {
        const blob = new Blob([conteudo], { type: tipo });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = nome;
        link.click();

        URL.revokeObjectURL(url);
    };

    const exportarCSV = () => {
        const linhas = data.map((row) =>
            colunas.map((c) => `"${(row[c] ?? "").toString().replace(/"/g, '""')}"`).join(",")
        );
        const csv = [colunas.join(","), ...linhas].join("\n");
        baixar(csv, `${fileName}.csv`, "text/csv;charset=utf-8");
    };


    const exportarSVG = () => {
        const w = 120, h = 30;
        const largura = colunas.length * w;
        const altura = (data.length + 1) * h;

        const linhasSVG = data
            .map((row, r) =>
                colunas
                    .map((col, c) => `<text x="${c * w + 5}" y="${(r + 2) * h - 10}">${row[col] ?? ""}</text>`)
                    .join("")
            )
            .join("");

        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">
<style>text{font-family:Arial;font-size:12px;}rect{fill:none;stroke:#000;}</style>
${colunas.map((col, i) => `<text x="${i * w + 5}" y="20" font-weight="bold">${col}</text>`).join("")}
${linhasSVG}
</svg>
`;

        baixar(svg, `${fileName}.svg`, "image/svg+xml;charset=utf-8");
    };


    const exportarPDF = () => {
        const pdf = new jsPDF("p", "pt", "a4");

        pdf.setFontSize(16);
        pdf.text(fileName, 40, 40);

        autoTable(pdf, {
            startY: 70,
            head: [colunas],
            body: data.map((row) => colunas.map((c) => String(row[c] ?? ""))),
            theme: "grid",


            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
                minCellWidth: 50,
            },


            tableWidth: "wrap",
            horizontalPageBreak: true,
            pageBreak: "auto",

            headStyles: {
                fillColor: [260, 260, 260], 
            },
        });

        pdf.save(`${fileName}.pdf`);
    };


    const exportarImagem = (tipo = "png") => {
        if (!chartRef?.current) {
            alert("Nenhum gráfico disponível.");
            return;
        }


        const canvas =
            chartRef.current.canvas ? chartRef.current.canvas : chartRef.current;

        try {
            const url = canvas.toDataURL(`image/${tipo}`);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.${tipo}`;
            link.click();
        } catch (err) {
            console.error("Erro ao gerar imagem:", err);
            alert("Erro ao exportar imagem. Verifique se o gráfico é um canvas válido.");
        }
    };

    return (
        <div className="flex justify-end -my-3 md:-mt-8">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span
                                        className="inline-flex items-center justify-center p-2 rounded-full
                           hover:bg-sky-600/10 focus:outline-none focus:ring-2 focus:ring-sky-300
                           cursor-pointer"
                                        aria-label="Baixar"
                                        role="button"
                                    >
                                        <Download className="w-4 h-4" />
                                    </span>
                                </TooltipTrigger>

                                <TooltipContent>
                                    <p>Baixar arquivo</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-28">
                    <DropdownMenuItem onClick={exportarCSV}>CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportarPDF}>PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportarSVG}>SVG</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    );
}
