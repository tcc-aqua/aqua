import { autenticarSindico } from "../middlewares/AuthMiddleware.js";
import RelatorioController from "../controllers/RelatorioController.js";

export default async function relatorioRoutes(fastify){
    fastify.get('/consumo-alto',  {preHandler: autenticarSindico}, RelatorioController.getUsersComConsumoAlto)
    fastify.get('/consumo-medio',  {preHandler: autenticarSindico}, RelatorioController.getConsumoMedio)
    fastify.get('/apartamentos',  {preHandler: autenticarSindico}, RelatorioController.getNumeroApartamentos)
    fastify.get('/vazamentos',  {preHandler: autenticarSindico}, RelatorioController.getUsersComVazamento)
    fastify.get('/status-sensores',  {preHandler: autenticarSindico}, RelatorioController.getSensoresStatus)
    fastify.get('/usuarios',  {preHandler: autenticarSindico}, RelatorioController.getUsuariosStatusSemana)
}