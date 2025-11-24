import RelatorioController from "../controllers/RelatorioController.js";

export default async function relatorioRoutes(fastify){
    fastify.get('/', RelatorioController.info)
}