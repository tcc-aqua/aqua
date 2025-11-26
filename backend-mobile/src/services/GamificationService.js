import GamificationLog from '../models/GamificationLog.js';
import User from '../models/User.js';
import Sensor from '../models/Sensor.js';
import LeituraSensor from '../models/LeituraSensor.js';
import Apartamento from '../models/Apartamento.js';
import sequelize from '../config/sequelize.js';
import { Op } from 'sequelize';

const PONTOS_POR_META_ATINGIDA = 50;

export default class GamificationService {

    // ... (mantenha os métodos awardPoints... e calculateTotalPoints existentes) ...

    static async getRanking() {
        try {
            // Agrupa pontos por usuário e ordena
            const ranking = await GamificationLog.findAll({
                attributes: [
                    'user_id',
                    [sequelize.fn('SUM', sequelize.col('points')), 'total_points']
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'img_url', 'residencia_type', 'residencia_id'] 
                }],
                group: ['user_id', 'User.id'],
                order: [[sequelize.fn('SUM', sequelize.col('points')), 'DESC']],
                limit: 10
            });
            return ranking;
        } catch (error) {
            console.error('Erro ao buscar ranking:', error);
            return [];
        }
    }

    static async getDesafioColetivo(user) {
        try {

            
            const hoje = new Date();
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);


            
            const consumoAtual = await LeituraSensor.sum('consumo', {
                where: {
                    data_registro: { [Op.between]: [inicioMes, fimMes] }
                }
            }) || 0;

            const metaColetiva = Math.max(consumoAtual * 1.2, 10000); 
            
            const progresso = Math.min(consumoAtual / metaColetiva, 1);

            return {
                title: 'Economia de Novembro',
                description: 'A comunidade precisa manter o consumo abaixo de 50mil Litros este mês!',
                consumoAtual,
                meta: metaColetiva,
                progresso // 0 a 1
            };
        } catch (error) {
            console.error('Erro no desafio coletivo:', error);
            return { progresso: 0, meta: 100, consumoAtual: 0 };
        }
    }
}