import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', UserController.getAll);
    fastify.get('/actives', UserController.getAllActives);
    fastify.get('/deactivates', UserController.getAllDeactivated);
    fastify.get('/:id', UserController.getById);
    fastify.put('/:id', UserController.update);
    fastify.post('/', UserController.create);
    fastify.put('/deactivate/:id', UserController.deactivate);

}