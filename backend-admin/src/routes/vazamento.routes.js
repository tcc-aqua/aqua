import TaxaVazamentoController from "../controllers/TaxaVazamentoController.js";

export default async function vazamentoRoutes(fastify) {
    fastify.get('/', {
        schema: {
            summary: 'Listando o vazamento entre sensores',
            tags: ['vazamentos'],
            description: 'Taxa de vazamento'
        }
    }, TaxaVazamentoController.get);
}