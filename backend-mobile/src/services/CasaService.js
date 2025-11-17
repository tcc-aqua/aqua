// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\services\CasaService.js
// CÓDIGO COMPLETO E CORRIGIDO

import Casa from "../models/Casa.js";
import User from "../models/User.js";
import LeituraSensor from "../models/LeituraSensor.js"; // 1. Importa o modelo das leituras

export default class CasaService {

    static async getConsumoTotal(casaId, userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user || user.residencia_id !== parseInt(casaId, 10) || user.residencia_type !== 'casa') {
                throw new Error('Acesso não autorizado ou residência não encontrada.');
            }

            // 2. Busca a casa para encontrar o ID do sensor
            const casa = await Casa.findByPk(casaId);

            if (!casa) {
                throw new Error('Casa não encontrada');
            }
            if (!casa.sensor_id) {
                throw new Error('Casa não possui um sensor associado.');
            }

            // 3. Soma o consumo da tabela de leituras
            const consumoTotal = await LeituraSensor.sum('consumo', {
                where: {
                    sensor_id: casa.sensor_id
                }
            });

            // 4. Retorna o valor somado no formato esperado
            return { consumoTotal: consumoTotal || 0 };
            
        } catch (error) {
            console.error('Erro ao buscar consumo total da casa:', error);
            throw error;
        }
    }
}