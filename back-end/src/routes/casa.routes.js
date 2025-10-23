import CasaController from "../controllers/CasaController.js";

export default async function casaRoutes(fastify) {

        fastify.get('/', CasaController.getAll);
        fastify.get('/ativos', CasaController.getAllAtivos);
        fastify.get('/inativos', CasaController.getAllInativos);
        fastify.get('/count', CasaController.count);
        fastify.get('/count-ativas', CasaController.countAtivas);
        fastify.patch('/:id/ativar', CasaController.ativar)
        fastify.patch('/:id/inativar', CasaController.inativar)
}