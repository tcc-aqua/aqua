import ComunicadosController from "../controllers/ComunicadosController.js";

export default async function comunicadoRoutes(fastify) {
    fastify.get('/', ComunicadosController.getAll);
    fastify.post('/', ComunicadosController.create);
}