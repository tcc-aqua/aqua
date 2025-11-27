import RelatorioController from "../controllers/RelatorioController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function relatorioRoutes(fastify){
    fastify.get('/',  {preHandler: autenticarSindico}, RelatorioController.info)
}