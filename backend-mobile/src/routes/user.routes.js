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

    fastify.get('/me/stats', {
        schema: {
            summary: 'Puxa as estatísticas do usuário logado',
            tags: ['users'],
            description: 'Retorna dados como metas cumpridas, pontos, etc.'
        },
        preHandler: [authMiddleware]
    }, UserController.getStats);
}