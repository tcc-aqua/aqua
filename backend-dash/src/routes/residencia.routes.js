import ResidenciaController from "../controllers/ResidenciaController.js";

export default async function residenciaRoutes(fastify) {

    fastify.get('/', ResidenciaController.getAll);
    fastify.get('/estados', ResidenciaController.getPorEstado);
}