import TaxaVazamentoController from "../controllers/TaxaVazamentoController.js";

export default async function vazamentoRoutes(fastify){
    fastify.get('/', TaxaVazamentoController.get);
}