// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\routes\casa.routes.js
// NOVO ARQUIVO

import CasaController from "../controllers/CasaController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js";

export default async function casaRoutes(fastify) {
    fastify.get('/:id/consumo-total',
        {
            preHandler: [authMiddleware], // Protegendo a rota
            schema: {
                summary: 'Consumo total de uma casa',
                tags: ['casas'],
                description: 'Lista o consumo total da residência (casa) do usuário autenticado.'
            }
        },
        CasaController.getConsumo
    );
}