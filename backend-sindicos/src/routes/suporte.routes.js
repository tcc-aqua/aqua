import SuporteController from "../controllers/SuporteController.js";

export default async function suporteRoutes(fastify) {
    fastify.get('/recebidas', SuporteController.countMensagensRecebidas);
    fastify.get('/enviadas', SuporteController.countMensagensEnviadas);
    fastify.get('/total-interacoes', SuporteController.countTotalInteracoes);
    fastify.get('/administrativo', SuporteController.countMensagensAdministrativo);
}