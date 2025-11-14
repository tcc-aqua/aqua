import ComunicadosController from "../controllers/ComunicadosController.js";

export default async function comunicadoRoutes(fastify) {
    fastify.get('/', ComunicadosController.getAll);
    fastify.post('/', ComunicadosController.create);
    fastify.put('/:id', ComunicadosController.update);
    fastify.delete('/:id', ComunicadosController.delete);
}