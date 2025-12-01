// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\controllers\CasaController.js
// NOVO ARQUIVO

import CasaService from "../services/CasaService.js";

export default class CasaController {
    static async getConsumo(req, reply) {
        try {
            const { id } = req.params;
            const userId = req.user.id; 
            const consumo = await CasaService.getConsumoTotal(id, userId);
            return reply.status(200).send(consumo);
        } catch (error) {
            console.error(error);
            return reply.status(404).send({ error: error.message });
        }
    }
}