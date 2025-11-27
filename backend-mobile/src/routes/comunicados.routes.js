import ComunicadosController from "../controllers/ComunicadosController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function comunicadosRoutes(fastify){
    fastify.get('/', { preHandler: [authMiddleware] }, ComunicadosController.getAll);
    
    fastify.post('/:id/lido', { preHandler: [authMiddleware] }, ComunicadosController.markAsRead);
}