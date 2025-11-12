import UpdateController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {
    fastify.put('/me', {
        schema: {
            summary: 'Alterando informações pessoal',
            tags: ['users'],
            description: 'Listando informações do usuário'
        }
    }, UpdateController.updateMe);
}