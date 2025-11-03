import MetasController from "../controllers/MetasController.js";

export default async function metasRoutes(fastify) {
    fastify.get('/', MetasController.getAll);
    fastify.post('/', MetasController.create);
}