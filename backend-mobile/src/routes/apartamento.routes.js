import ApartamentoController from "../controllers/ApartamentoController.js";

export default async function apartamentoRoutes(fastify){

    fastify.get('/:id/consumo-total', ApartamentoController.getConsumo);

}