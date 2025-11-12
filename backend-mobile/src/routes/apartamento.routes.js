import ApartamentoController from "../controllers/ApartamentoController.js";

export default async function apartamentoRoutes(fastify) {

    fastify.get('/:id/consumo-total',
        {
            schema: {
                summary: 'Consumo total de cada apartamento de usuário',
                tags: ['apartamentos'],
                description: 'Listando consumo total da residencia (apartamento) do usuário'
            }
        },
        ApartamentoController.getConsumo);
}