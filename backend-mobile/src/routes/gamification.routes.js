import GamificationController from "../controllers/GamificationController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function gamificationRoutes(fastify) {
    fastify.get('/ranking', { preHandler: [authMiddleware] }, GamificationController.getRanking);
    fastify.get('/desafio', { preHandler: [authMiddleware] }, GamificationController.getDesafioColetivo);
}