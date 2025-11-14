import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {
    fastify.get('/', {
        schema: {
            summary: 'Listando todos os usuários do sistema',
            tags: ['users'],
            description: 'Listando todos os usuários do condominio do sindico'
        }
    }, UserController.getAll);
}