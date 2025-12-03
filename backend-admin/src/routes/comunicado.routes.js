import ComunicadosController from "../controllers/ComunicadosController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function comunicadoRoutes(fastify) {
    fastify.get('/', ComunicadosController.getAll);
    fastify.post('/', ComunicadosController.create);
    fastify.put('/:id', { preHandler: autenticarAdmin }, ComunicadosController.update);
    fastify.delete('/:id', ComunicadosController.delete);
    fastify.post("/ler", ComunicadosController.marcarComoLido);
    fastify.get("/nao-lidos", ComunicadosController.getNaoLidos);
}