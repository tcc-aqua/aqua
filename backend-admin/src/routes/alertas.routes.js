import AlertasController from "../controllers/AlertaController.js";

export default async function alertasRoutes(fastify) {

    fastify.get('/', AlertasController.getAll);
    fastify.get('/ativos', AlertasController.getAllAtivos);
    fastify.get('/inativos', AlertasController.getAllInativos);
    fastify.get('/recentes', AlertasController.getRecentes);
    fastify.get('/count/ativos', AlertasController.countAtivos);
    fastify.get('/count/vazamentos', AlertasController.countVazamentos);
    fastify.get('/count/consumo-alto', AlertasController.countConsumoAlto);
    fastify.get('/:id/count/casas', AlertasController.countPorCasa);
    fastify.get('/:id/count/apartamentos', AlertasController.countPorApartamento);
    fastify.get('/count/condominios', AlertasController.countPorCondominio);
    fastify.post('/', AlertasController.create);
    fastify.patch('/:id', AlertasController.resolverAlerta);

}