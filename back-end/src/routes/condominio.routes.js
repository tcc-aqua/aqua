import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify){

    fastify.get('/', CondominioController.getAll);
    fastify.get('/ativos', CondominioController.getAllActives);
    fastify.get('/inativos', CondominioController.getAllInativos);
    fastify.post('/', CondominioController.create);
    fastify.put('/:id', CondominioController.update);
    fastify.put('/inativar/:id', CondominioController.inativar);
}