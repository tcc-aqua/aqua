import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', UserController.getAll);
    fastify.get('/ativos', UserController.getAllActives);
    fastify.get('/inativos', UserController.getAllDeactivated);
    fastify.get('/count', UserController.count);
    fastify.get('/:id', UserController.getById);
    fastify.put('/:id', UserController.update);
    fastify.post('/', UserController.create);
    fastify.patch('/:id/inativar', UserController.deactivate);

}