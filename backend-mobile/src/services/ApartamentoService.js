import Apartamento from "../models/Apartamento.js";
import LeituraSensor from "../models/LeituraSensor.js";
import { Op } from "sequelize"; // <--- IMPORTANTE

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

            // Definição do início e fim do dia de hoje
            const hojeInicio = new Date();
            hojeInicio.setHours(0, 0, 0, 0);
            
            const hojeFim = new Date();
            hojeFim.setHours(23, 59, 59, 999);

            // 1. Consumo de HOJE
            const consumoHoje = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: apartamento.sensor_id,
                    data_registro: {
                        [Op.between]: [hojeInicio, hojeFim]
                    }
                }
            });

            // 2. Consumo TOTAL (Histórico)
            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: apartamento.sensor_id
                }
            });

            return { 
                consumoHoje: consumoHoje || 0,
                consumoTotal: consumoTotal || 0 
            };

        } catch (error) {
            console.error('Erro ao listar consumo do apartamento', error);
            throw error;
        }
    }
}