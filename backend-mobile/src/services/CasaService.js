import Casa from "../models/Casa.js";
import User from "../models/User.js";
import LeituraSensor from "../models/LeituraSensor.js";
import { Op } from "sequelize"; // <--- IMPORTANTE

export default class CasaService {

    static async getConsumoTotal(casaId, userId) {
        try {
            const user = await User.findByPk(userId);
            // Validações removidas para brevidade, mantenha as suas se quiser
            
            const casa = await Casa.findByPk(casaId);
            if (!casa || !casa.sensor_id) {
                throw new Error('Casa ou sensor não encontrado.');
            }

            const hojeInicio = new Date();
            hojeInicio.setHours(0, 0, 0, 0);
            const hojeFim = new Date();
            hojeFim.setHours(23, 59, 59, 999);

            // 1. Consumo de HOJE
            const consumoHoje = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: casa.sensor_id,
                    data_registro: {
                        [Op.between]: [hojeInicio, hojeFim]
                    }
                }
            });

            // 2. Consumo TOTAL
            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: casa.sensor_id
                }
            });

            return { 
                consumoHoje: consumoHoje || 0,
                consumoTotal: consumoTotal || 0 
            };
            
        } catch (error) {
            console.error('Erro ao buscar consumo da casa:', error);
            throw error;
        }
    }
}