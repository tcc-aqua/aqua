import ApartamentoController from "../controllers/ApartamentoController.js";

export default async function unidadeRoutes(fastify) {

    fastify.get('/', ApartamentoController.getAll);
    fastify.get('/ativos', ApartamentoController.getAllAtivos);
    fastify.get('/inativos', ApartamentoController.getAllInativos);
    fastify.get('/count', ApartamentoController.count);
    fastify.patch('/:id/inativar', ApartamentoController.inativar);
    fastify.patch('/:id/ativar', ApartamentoController.ativar);

}