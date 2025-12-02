import MetasController from "../controllers/MetasController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function metasRoutes(fastify) {
    fastify.get('/', { preHandler: [authMiddleware] }, MetasController.getAll);
    fastify.post('/', { preHandler: [authMiddleware] }, MetasController.create);
    fastify.put('/:id', { preHandler: [authMiddleware] }, MetasController.update);
    fastify.delete('/:id', { preHandler: [authMiddleware] }, MetasController.delete);
    fastify.patch('/:id/principal', { preHandler: [authMiddleware] }, MetasController.setPrincipal);
}