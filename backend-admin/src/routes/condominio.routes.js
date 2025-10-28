import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify){

    fastify.get('/', CondominioController.getAll);
    fastify.get('/ativos', CondominioController.getAllActives);
    fastify.get('/inativos', CondominioController.getAllInativos);
    fastify.get('/count', CondominioController.count);
    fastify.get('/:id/apartamentos', CondominioController.count);
    fastify.post('/', CondominioController.create);
    fastify.put('/:id', CondominioController.update);
    fastify.patch('/:id/inativar', CondominioController.inativar);
    fastify.patch('/:id/ativar', CondominioController.ativar);
}