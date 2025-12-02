import SuporteController from "../controllers/SuporteController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";


export default async function suporteRoutes(fastify) {
    fastify.get('/', { preHandler: [autenticarSindico] }, SuporteController.getAllMensagens);
    fastify.get('/recebidas', { preHandler: autenticarSindico }, SuporteController.countMensagensRecebidas);
    fastify.get('/enviadas', { preHandler: autenticarSindico }, SuporteController.countMensagensEnviadas);
    fastify.get('/total-interacoes', { preHandler: autenticarSindico }, SuporteController.countTotalInteracoes);
    fastify.get('/admin', { preHandler: autenticarSindico }, SuporteController.countMensagensAdministrativo);
    fastify.post('/enviar-usuario', { preHandler: [autenticarSindico] }, SuporteController.enviarMensagemUsuario);
}