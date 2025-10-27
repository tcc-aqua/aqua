import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', {
        schema: {
            description: 'Lista todos os usuários do sistema',
            tags: ['users'],
            description: 'List Users'
        }
    },   UserController.getAll
    );

    fastify.get('/ativos', UserController.getAllActives);
    fastify.get('/inativos', UserController.getAllDeactivated);
    fastify.get('/casa', UserController.getAllMoramEmCasa);
    fastify.get('/condominio', UserController.getAllMoramCondominio);
    fastify.get('/count', UserController.count);
    fastify.get('/count-ativos', UserController.countAtivos);
    fastify.get('/count-sindicos', UserController.countSindicos);
    fastify.get('/count-moradores', UserController.countMoradores);
    fastify.get('/:id', UserController.getById);
    fastify.patch('/:id/inativar', UserController.deactivate);
    fastify.patch('/:id/ativar', UserController.ativar);

}