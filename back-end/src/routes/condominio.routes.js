import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify){

    fastify.get('/', CondominioController.getAll);
    fastify.get('/actives', CondominioController.getAllActives);
    fastify.get('/deactivates', CondominioController.getAllInativos);
    fastify.post('/', CondominioController.create);
    fastify.put('/:id', CondominioController.update);
    fastify.put('/inativar/:id', CondominioController.inativar);
}