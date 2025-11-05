import SuporteController from "../controllers/SuporteController.js";

export default async function suporteRoutes(fastify){

    fastify.get('/', SuporteController.getAll);

}