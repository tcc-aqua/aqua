

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
}