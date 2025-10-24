import AlertasController from "../controllers/AlertaController.js";

export default async function alertasRoutes(fastify) {

    fastify.get('/', AlertasController.getAll);
    fastify.get('/ativos', AlertasController.getAllAtivos);
    fastify.get('/inativos', AlertasController.getAllInativos);
    fastify.get('/count-ativos', AlertasController.countAtivos);
    fastify.get('/count-casas', AlertasController.countPorCasa);
    fastify.get('/count-apartamentos', AlertasController.countTotalPorApartamento);
    fastify.get('/count-condominio', AlertasController.countPorCondominio);
    fastify.post('/', AlertasController.create);
    fastify.patch('/:id', AlertasController.resolverAlerta);

}