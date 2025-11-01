import LeituraSensorController from "../controllers/LeituraSensor.js";

export default async function leituraRoutes(fastify){

    fastify.get('/', LeituraSensorController.getAll);

}