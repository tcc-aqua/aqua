import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', UserController.getAll);
    fastify.get('/ativos', UserController.getAllActives);
    fastify.get('/inativos', UserController.getAllDeactivated);
    fastify.get('/count', UserController.count);
    fastify.get('/count-ativos', UserController.countAtivos);
    fastify.get('/count-sindicos', UserController.countSindicos);
    fastify.get('/count-moradores', UserController.countMoradores);
    fastify.get('/:id', UserController.getById);
    fastify.patch('/:id/inativar', UserController.deactivate);
    fastify.patch('/:id/ativar', UserController.ativar);

}