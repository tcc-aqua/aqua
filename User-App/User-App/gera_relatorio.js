const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
// Especifique os caminhos para as pastas que você deseja analisar.
// (Adaptado dos 'TARGET_FOLDER' do Código 2)
const diretoriosParaAnalisar = [
    'C:/Users/24250553/Documents/3mdR/aqua/backend-mobile/src',
    'C:/Users/24250553/Documents/3mdR/aqua/User-App/User-App/screens'
];

// Especifique o nome do arquivo de texto que será gerado.
const arquivoDeSaida = 'relatorio_codigo_combinado.txt';

// Lista de diretórios e arquivos a serem ignorados.
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
    '.env',
];
// --- FIM DA CONFIGURAÇÃO ---

// Limpa o arquivo de saída se ele já existir
if (fs.existsSync(arquivoDeSaida)) {
    fs.unlinkSync(arquivoDeSaida);
}

/**
 * Função recursiva para ler todos os arquivos em um diretório e seus subdiretórios.
 * @param {string} diretorioAbsoluto - O caminho absoluto do diretório a ser lido.
 */
function lerDiretoriosRecursivamente(diretorioAbsoluto) {
    try {
        const itens = fs.readdirSync(diretorioAbsoluto);

        for (const item of itens) {
            if (listaDeIgnorados.includes(item)) {
                continue;
            }

            const caminhoAbsolutoItem = path.join(diretorioAbsoluto, item);

            try {
                const stats = fs.lstatSync(caminhoAbsolutoItem);

                if (stats.isSymbolicLink()) {
                    console.log(`Ignorando link simbólico: ${caminhoAbsolutoItem}`);
                    continue;
                }

                if (stats.isDirectory()) {
                    lerDiretoriosRecursivamente(caminhoAbsolutoItem);
                } else if (stats.isFile() && (
                    caminhoAbsolutoItem.endsWith('.js') || 
                    caminhoAbsolutoItem.endsWith('.jsx') ||
                    caminhoAbsolutoItem.endsWith('.ts') || // Adicionado para TypeScript
                    caminhoAbsolutoItem.endsWith('.tsx')  // Adicionado para TypeScript
                    )) {
                    
                    console.log(`Lendo arquivo: ${caminhoAbsolutoItem}`);
                    const conteudoDoArquivo = fs.readFileSync(caminhoAbsolutoItem, 'utf8');

                    const dadosParaAdicionar = `
// =================================================================================
// Arquivo: ${caminhoAbsolutoItem}
// =================================================================================

${conteudoDoArquivo}

`;
                    fs.appendFileSync(arquivoDeSaida, dadosParaAdicionar);
                }
            } catch (statError) {
                console.warn(`AVISO: Não foi possível acessar '${caminhoAbsolutoItem}'. Erro: ${statError.code}. Pulando.`);
            }
        }
    } catch (readDirError) {
        console.error(`ERRO: Não foi possível ler o diretório '${diretorioAbsoluto}'. Erro: ${readDirError.code}. Pulando.`);
    }
}

// --- EXECUÇÃO PRINCIPAL (MODIFICADA) ---

console.log(`Iniciando a análise...`);

// Itera sobre cada diretório inicial especificado na configuração
for (const diretorioInicial of diretoriosParaAnalisar) {
    const diretorioAbsoluto = path.resolve(diretorioInicial);

    if (!fs.existsSync(diretorioAbsoluto)) {
        console.warn(`AVISO: O diretório ${diretorioAbsoluto} não foi encontrado. Pulando.`);
        continue;
    }

    console.log(`\n--- Analisando o diretório base: ${diretorioAbsoluto} ---`);
    
    // Adiciona um cabeçalho principal no arquivo de saída para cada pasta base
    const cabecalhoDaPasta = `
// #################################################################################
// INÍCIO DA ANÁLISE DE: ${diretorioAbsoluto}
// #################################################################################
`;
    fs.appendFileSync(arquivoDeSaida, cabecalhoDaPasta);

    // Inicia a leitura recursiva para este diretório
    lerDiretoriosRecursivamente(diretorioAbsoluto);
}

console.log(`\nProcesso finalizado! O arquivo "${arquivoDeSaida}" foi criado com sucesso.`);