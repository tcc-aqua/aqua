import ComunicadosController from "../controllers/ComunicadoController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function comunicadosRoutes(fastify){
    fastify.get('/',  { preHandler: autenticarSindico }, ComunicadosController.getAllComunicados);
    fastify.post('/', { preHandler: autenticarSindico }, ComunicadosController.addComunicado);
}