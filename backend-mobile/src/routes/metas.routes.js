import MetasController from "../controllers/MetasController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function metasRoutes(fastify) {
    // Rota de estatísticas deve vir ANTES de rotas com parâmetros dinâmicos (embora aqui não tenha /:id, é boa prática)
    
    fastify.get('/stats', {
        schema: {
            summary: 'Estatísticas de metas',
            tags: ['metas'],
            description: 'Retorna contagem de metas ativas, concluídas e pontos'
        },
        preHandler: [authMiddleware] 
    }, MetasController.getStats);

    fastify.get('/',
        {
            schema: {
                summary: 'Listando todas as metas do usuário',
                tags: ['metas'],
                description: 'Metas do usuário referente ao consumo.'
            },
            preHandler: [authMiddleware]
        },
        MetasController.getAll);

    fastify.post('/', 
        {
            schema: {
                summary: 'Criando uma nova meta',
                tags: ['metas'],
                description: 'Criando uma nova meta referente ao consumo de água'
            },
            preHandler: [authMiddleware]
        },
        MetasController.create);
}