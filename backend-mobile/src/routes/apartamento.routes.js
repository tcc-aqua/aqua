import ApartamentoController from "../controllers/ApartamentoService.js";

export default async function apartamentoRoutes(fastify){

    fastify.get('/:id/consumo-total', ApartamentoController.getConsumo);

}