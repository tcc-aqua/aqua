import ComunicadosController from "../controllers/ComunicadoController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function comunicadosRoutes(fastify){
    fastify.get('/',  { preHandler: autenticarSindico }, ComunicadosController.getAllComunicados);
    fastify.get('/total',  { preHandler: autenticarSindico }, ComunicadosController.getTotalCount);
    fastify.post('/', { preHandler: autenticarSindico }, ComunicadosController.addComunicado);
}