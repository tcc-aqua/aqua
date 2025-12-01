import ComunicadosController from "../controllers/ComunicadoController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function comunicadosRoutes(fastify) {
    fastify.get('/', { preHandler: autenticarSindico }, ComunicadosController.getAllComunicados);
    fastify.get('/total', { preHandler: autenticarSindico }, ComunicadosController.getTotalCount);
    fastify.get('/me', { preHandler: autenticarSindico }, ComunicadosController.getMyTotalCount);
    fastify.get('/nao-lidos-count', { preHandler: autenticarSindico }, ComunicadosController.getNaoLidosCount);
    fastify.put('/:id/status/lido', { preHandler: autenticarSindico }, ComunicadosController.updateLidoStatus);
    fastify.post('/', { preHandler: autenticarSindico }, ComunicadosController.addComunicado);
}