import { autenticarSindico } from "../middlewares/AuthMiddleware.js";
import RelatorioController from "../controllers/RelatorioController.js";

export default async function relatorioRoutes(fastify){
    fastify.get('/consumo-alto',  {preHandler: autenticarSindico}, RelatorioController.getUsersComConsumoAlto)
    fastify.get('/consumo-medio',  {preHandler: autenticarSindico}, RelatorioController.getConsumoMedio)
}