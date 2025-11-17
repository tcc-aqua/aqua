// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\services\ApartamentoService.js
// CÓDIGO COMPLETO E CORRIGIDO

import Apartamento from "../models/Apartamento.js";
import LeituraSensor from "../models/LeituraSensor.js"; // 1. Importa o modelo das leituras

export default class ApartamentoService {

    static async getConsumoTotal(apartamentoId) {
        try {

            const apartamento = await Apartamento.findByPk(apartamentoId);

            if (!apartamento) {
                throw new Error('Apartamento não encontrado');
            }
            if (!apartamento.sensor_id) {
                throw new Error('Apartamento não possui um sensor associado.');
            }


            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: apartamento.sensor_id
                }
            });


            return { consumoTotal: consumoTotal || 0 };

        } catch (error) {
            console.error('Erro ao listar consumo total do seu apartamento', error);
            throw error;
        }
    }

}