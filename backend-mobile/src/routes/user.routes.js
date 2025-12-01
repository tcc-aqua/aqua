// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\routes\user.routes.js

import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function userRoutes(fastify) {
    fastify.put('/me', {
        schema: {
            summary: 'Alterando informações pessoal',
            tags: ['users'],
            description: 'Listando informações do usuário'
        },
        preHandler: [authMiddleware]
    }, UserController.updateMe);


    fastify.post('/upload-img', {
        schema: {
            summary: 'Upload da foto de perfil do usuário',
            tags: ['users'],
            description: 'Envia uma imagem para ser usada como foto de perfil do usuário logado.'
        },
        preHandler: [authMiddleware]
    }, UserController.uploadProfile);

    fastify.get('/me/stats', {
        schema: {
            summary: 'Puxa as estatísticas do usuário logado',
            tags: ['users'],
            description: 'Retorna dados como metas cumpridas, pontos, etc.'
        },
        preHandler: [authMiddleware]
    }, UserController.getStats);

    // --- NOVA ROTA PARA O GRÁFICO ---
    fastify.get('/me/consumo-semanal', {
        schema: {
            summary: 'Histórico de consumo semanal',
            tags: ['users'],
            description: 'Retorna o consumo agrupado por dia dos últimos 7 dias.'
        },
        preHandler: [authMiddleware]
    }, UserController.getConsumoSemanal);
}