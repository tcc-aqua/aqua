const fs = require('fs');
const path = require('path');

const diretoriosParaAnalisar = [
    'C:/Users/24250553/Documents/3mdR/aqua/backend-mobile/src',
    'C:/Users/24250553/Documents/3mdR/aqua/User-App/User-App/screens',
    'C:/Users/24250553/Documents/3mdR/aqua/backend-admin/src'
];

const arquivoDeSaida = 'relatorio_codigo_combinado.txt';

const listaDeIgnorados = [
    'node_modules',
    '.git',
    '.vscode',
    '.next',
    'dist',
    'build',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    '.env'
];

if (fs.existsSync(arquivoDeSaida)) {
    fs.unlinkSync(arquivoDeSaida);
}

function lerDiretoriosRecursivamente(diretorioAbsoluto) {
    try {
        const itens = fs.readdirSync(diretorioAbsoluto);

        for (const item of itens) {
            if (listaDeIgnorados.includes(item)) continue;

            const caminhoAbsolutoItem = path.join(diretorioAbsoluto, item);

            try {
                const stats = fs.lstatSync(caminhoAbsolutoItem);

                if (stats.isSymbolicLink()) continue;

                if (stats.isDirectory()) {
                    lerDiretoriosRecursivamente(caminhoAbsolutoItem);
                } else if (
                    stats.isFile() &&
                    (
                        caminhoAbsolutoItem.endsWith('.js') ||
                        caminhoAbsolutoItem.endsWith('.jsx') ||
                        caminhoAbsolutoItem.endsWith('.ts') ||
                        caminhoAbsolutoItem.endsWith('.tsx')
                    )
                ) {
                    const conteudoDoArquivo = fs.readFileSync(caminhoAbsolutoItem, 'utf8');

                    const dadosParaAdicionar = `
=================================================================================
Arquivo: ${caminhoAbsolutoItem}
=================================================================================

${conteudoDoArquivo}

`;
                    fs.appendFileSync(arquivoDeSaida, dadosParaAdicionar);
                }
            } catch {}
        }
    } catch {}
}

console.log(`Iniciando a análise...`);

for (const diretorioInicial of diretoriosParaAnalisar) {
    const diretorioAbsoluto = path.resolve(diretorioInicial);

    if (!fs.existsSync(diretorioAbsoluto)) {
        console.warn(`AVISO: O diretório ${diretorioAbsoluto} não foi encontrado. Pulando.`);
        continue;
    }

    const cabecalhoDaPasta = `
#################################################################################
INÍCIO DA ANÁLISE DE: ${diretorioAbsoluto}
#################################################################################
`;
    fs.appendFileSync(arquivoDeSaida, cabecalhoDaPasta);

    lerDiretoriosRecursivamente(diretorioAbsoluto);
}

console.log(`Processo finalizado! O arquivo "${arquivoDeSaida}" foi criado.`);
