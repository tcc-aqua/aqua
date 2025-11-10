import CrescimentoController from "../controllers/CrescimentoController.js";

export default async function crescimentoRoutes(fastify){
    fastify.get('/', CrescimentoController.get);
}