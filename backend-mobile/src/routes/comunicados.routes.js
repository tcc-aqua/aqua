import ComunicadosController from "../controllers/ComunicadosController.js";

export default async function comunicadosRoutes(fastify){
    fastify.get('/', ComunicadosController.getAll);
}