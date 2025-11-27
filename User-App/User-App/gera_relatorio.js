const fs = require('fs');
const path = require('path');

// CONFIGURAÇÃO DOS DIRETÓRIOS
// Apontei para a raiz das pastas (removi /src e /screens) para pegar configurações como tsconfig, babel, etc.
// Removi o backend-admin conforme pedido.
const diretoriosParaAnalisar = [
    'C:/Users/24250553/Documents/3mdR/aqua/backend-mobile',
    'C:/Users/24250553/Documents/3mdR/aqua/User-App/User-App'
];

const arquivoDeSaida = 'relatorio_mobile_e_app.txt';

// Pastas e arquivos que devem ser TOTALMENTE ignorados
const listaDeIgnorados = [
    'node_modules',
    '.git',
    '.vscode',
    '.idea',
    '.next',
    'dist',
    'build',
    'coverage',
    '.expo',
    'package-lock.json',
    'yarn.lock',
];

const extensoesBinarias = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.bmp', '.webp',
    '.mp4', '.mp3', '.wav', '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar',
    '.exe', '.dll', '.bin', '.class', '.ttf', '.woff', '.woff2', '.eot', '.otf',
    '.keystore', '.jks'
];

// Limpa o arquivo de saída anterior se existir
if (fs.existsSync(arquivoDeSaida)) {
    fs.unlinkSync(arquivoDeSaida);
}

function lerDiretoriosRecursivamente(diretorioAbsoluto) {
    let itens;
    try {
        itens = fs.readdirSync(diretorioAbsoluto);
    } catch (erro) {
        console.error(`ERRO: Não foi possível ler o diretório ${diretorioAbsoluto}.`);
        return;
    }

    for (const item of itens) {
        if (listaDeIgnorados.includes(item)) continue;

        const caminhoAbsolutoItem = path.join(diretorioAbsoluto, item);

        try {
            const stats = fs.lstatSync(caminhoAbsolutoItem);

            if (stats.isSymbolicLink()) continue;

            if (stats.isDirectory()) {
                // Se for pasta, entra nela (recursão)
                lerDiretoriosRecursivamente(caminhoAbsolutoItem);
            } else if (stats.isFile()) {
                // Verifica a extensão para ver se é binário
                const extensao = path.extname(caminhoAbsolutoItem).toLowerCase();

                // Se NÃO for um arquivo binário (imagem/executável), lê o texto
                if (!extensoesBinarias.includes(extensao)) {
                    const conteudoDoArquivo = fs.readFileSync(caminhoAbsolutoItem, 'utf8');

                    const dadosParaAdicionar = `
=================================================================================
Arquivo: ${caminhoAbsolutoItem}
=================================================================================

${conteudoDoArquivo}

`;
                    fs.appendFileSync(arquivoDeSaida, dadosParaAdicionar);
                } else {
                    // Opcional: Avisar no TXT que o arquivo existe, mas foi pulado por ser binário
                    const avisoBinario = `
=================================================================================
Arquivo: ${caminhoAbsolutoItem}
[CONTEÚDO BINÁRIO IGNORADO PARA MANTER A INTEGRIDADE DO TEXTO]
=================================================================================
`;
                    fs.appendFileSync(arquivoDeSaida, avisoBinario);
                }
            }
        } catch (err) {
            console.log(`Erro ao processar arquivo: ${caminhoAbsolutoItem}`);
        }
    }
}

console.log(`Iniciando a varredura (Back-end Mobile e User App)...`);

for (const diretorioInicial of diretoriosParaAnalisar) {
    const diretorioAbsoluto = path.resolve(diretorioInicial);

    if (!fs.existsSync(diretorioAbsoluto)) {
        console.warn(`AVISO: O diretório ${diretorioAbsoluto} não foi encontrado. Pulando.`);
        continue;
    }

    const cabecalhoDaPasta = `
#################################################################################
INÍCIO DA ANÁLISE DA PASTA: ${diretorioAbsoluto}
#################################################################################
`;
    fs.appendFileSync(arquivoDeSaida, cabecalhoDaPasta);

    lerDiretoriosRecursivamente(diretorioAbsoluto);
}

console.log(`Sucesso! Todo o código foi salvo em: "${arquivoDeSaida}"`);