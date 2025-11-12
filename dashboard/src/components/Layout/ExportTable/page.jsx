"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function ExportarTabela({ data = [], fileName = "dados" }) {
    if (!data.length) return null;

    // 🔹 Função genérica para baixar arquivos
    const baixar = (conteudo, nome, tipo) => {
        const blob = new Blob([conteudo], { type: tipo });
        const url = URL.createObjectURL(blob);
        const link = Object.assign(document.createElement("a"), {
            href: url,
            download: nome,
        });
        link.click();
        URL.revokeObjectURL(url);
    };

    const colunas = Object.keys(data[0]);

    // 🔹 Exportar como CSV
    const exportarCSV = () => {
        const linhas = data.map((row) =>
            colunas.map((c) => `"${(row[c] ?? "").toString().replace(/"/g, '""')}"`).join(",")
        );
        const csv = [colunas.join(","), ...linhas].join("\n");
        baixar(csv, `${fileName}.csv`, "text/csv");
    };

    // 🔹 Exportar como XML
    const exportarXML = () => {
        const xml =
            `<?xml version="1.0"?>\n<dados>\n` +
            data
                .map(
                    (item) =>
                        `  <registro>\n${Object.entries(item)
                            .map(([k, v]) => `    <${k}>${v}</${k}>`)
                            .join("\n")}\n  </registro>`
                )
                .join("\n") +
            "\n</dados>";
        baixar(xml, `${fileName}.xml`, "application/xml");
    };

    // 🔹 Exportar como SVG
    const exportarSVG = () => {
        const w = 120, h = 30;
        const largura = colunas.length * w;
        const altura = (data.length + 1) * h;

        const linhasSVG = data
            .map((row, r) =>
                colunas
                    .map(
                        (col, c) =>
                            `<text x="${c * w + 5}" y="${(r + 2) * h - 10}">${row[col] ?? ""}</text>`
                    )
                    .join("")
            )
            .join("");

        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}">
  <style>text{font-family:Arial;font-size:12px;}rect{fill:none;stroke:#000;}</style>
  ${colunas
                .map((col, i) => `<text x="${i * w + 5}" y="20" font-weight="bold">${col}</text>`)
                .join("")}
  ${linhasSVG}
  ${Array.from({ length: data.length + 2 })
                .map((_, i) => `<line x1="0" y1="${i * h}" x2="${largura}" y2="${i * h}" stroke="black"/>`)
                .join("")}
  ${Array.from({ length: colunas.length + 1 })
                .map((_, i) => `<line x1="${i * w}" y1="0" x2="${i * w}" y2="${altura}" stroke="black"/>`)
                .join("")}
</svg>`;
        baixar(svg, `${fileName}.svg`, "image/svg+xml");
    };

    // 🔹 Exportar como HTML (PDF-friendly)
    const exportarPDF = () => {
        const linhas = data
            .map(
                (row) => `<tr>${colunas.map((c) => `<td>${row[c] ?? ""}</td>`).join("")}</tr>`
            )
            .join("");
        const html = `
<html>
<head>
<meta charset="UTF-8" />
<title>${fileName}</title>
<style>
table{border-collapse:collapse;width:100%;font-family:Arial;font-size:12px;}
th,td{border:1px solid #000;padding:4px;text-align:left;}
th{background:#f2f2f2;}
</style>
</head>
<body>
<h2>${fileName}</h2>
<table>
<thead><tr>${colunas.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
<tbody>${linhas}</tbody>
</table>
</body>
</html>`;
        baixar(html, `${fileName}.html`, "text/html");
    };

    return (
        <div className="flex justify-end my-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:-mt-10">
                        <Download className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-20">
                    <DropdownMenuItem onClick={exportarCSV}>CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportarPDF}>PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportarSVG}>SVG</DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={exportarXML}>XML</DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
