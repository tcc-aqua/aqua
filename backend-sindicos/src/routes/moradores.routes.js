import MoradoresController from "../controllers/Moradores.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function moradoresRoutes(fastify){
    fastify.get('/', {preHandler: [autenticarSindico]}, MoradoresController.info);
}