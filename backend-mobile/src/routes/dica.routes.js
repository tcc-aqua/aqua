import DicaController from "../controllers/DicaController.js";

export default async function dicaRoutes(fastify){
    fastify.get('/', DicaController.getDicaDoDia);
}