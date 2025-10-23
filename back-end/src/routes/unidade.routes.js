import UnidadeController from "../controllers/UnidadeController.js";

export default async function unidadeRoutes(fastify) {

    fastify.get('/', UnidadeController.getAll);
    fastify.get('/ativos', UnidadeController.getAllAtivos);
    fastify.get('/inativos', UnidadeController.getAllInativos);
    fastify.get('/count', UnidadeController.count);
    fastify.patch('/:id/inativar', UnidadeController.inativar);

}