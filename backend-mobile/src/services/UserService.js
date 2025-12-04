import { Op } from 'sequelize';
import User from "../models/User.js";
import Metas from "../models/Metas.js";
import LeituraSensor from '../models/LeituraSensor.js';
import Casa from '../models/Casa.js';
import Apartamento from '../models/Apartamento.js';
import sequelize from '../config/sequelize.js';
import GamificationLog from '../models/GamificationLog.js'; // Import novo

const PRECO_POR_LITRO = 0.015;

export default class UserService {
    // MANTIDO: Consumo Semanal
    static async getWeeklyConsumption(userId) {
        // ... (Seu código de consumo semanal que já funcionava fica aqui) ...
        // Vou resumir para não ficar gigante, mas mantenha a lógica do Op.gte e sequelize.fn
         try {
            const user = await User.findByPk(userId, {
                include: [{ model: Casa, as: 'casa' }, { model: Apartamento, as: 'apartamento' }]
            });
            if (!user) throw new Error('Usuário não encontrado');
            const sensorId = user.residencia_type === 'casa' ? user.casa?.sensor_id : user.apartamento?.sensor_id;
            if (!sensorId) return [];

            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            seteDiasAtras.setHours(0, 0, 0, 0);

            const leituras = await LeituraSensor.findAll({
                where: { sensor_id: sensorId, data_registro: { [Op.gte]: seteDiasAtras } },
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('data_registro')), 'data_leitura'],
                    [sequelize.fn('SUM', sequelize.col('consumo')), 'total_litros']
                ],
                group: [sequelize.fn('DATE', sequelize.col('data_registro'))],
                order: [[sequelize.fn('DATE', sequelize.col('data_registro')), 'ASC']],
                raw: true
            });
            return leituras.map(item => {
                let dataString = item.data_leitura instanceof Date ? item.data_leitura.toISOString().split('T')[0] : item.data_leitura;
                const [ano, mes, dia] = dataString.toString().split('-');
                return { data: `${dia}/${mes}`, consumo: parseFloat(item.total_litros) };
            });
        } catch (error) { throw error; }
    }
    
    // ATUALIZADO: updateMe (aceita nickname)
    static async updateMe(userId, data) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Usuário não encontrado');

            // Adicionado 'nickname'
            const allowedUpdates = ['name', 'email', 'cpf', 'password', 'nickname'];
            
            const updateData = {};
            for (const key of allowedUpdates) {
                if (data[key] !== undefined && data[key] !== '') updateData[key] = data[key];
            }
            await user.update(updateData);
            return user;
        } catch (error) { throw error; }
    }

    // MANTIDO: Upload Foto
    static async uploadProfilePicture(userId, file) {
        // ... (Mantenha seu código de upload igual) ...
        try {
            const user = await User.findByPk(userId);
            const buffer = await file.toBuffer();
            const base64Image = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
            user.img_url = base64Image;
            await user.save();
            return base64Image;
        } catch (error) { throw error; }
    }

    // ATUALIZADO: getUserStats (Pontos Reais)
    static async getUserStats(userId) {
        try {
            const user = await User.findByPk(userId);
            // ... (cálculo de tempo no app e metas mantido) ...
            const hoje = new Date();
            const dataCriacao = new Date(user.criado_em);
            const tempo_no_app = Math.ceil(Math.abs(hoje - dataCriacao) / (1000 * 60 * 60 * 24));
            const metas_cumpridas = await Metas.count({ where: { user_id: userId, status: 'atingida' } });
            
            // Logica simplificada de economia (pode manter a sua completa se preferir)
            let agua_poupada = 0; 

            // --- PONTOS REAIS ---
            const totalPointsResult = await GamificationLog.sum('points', { where: { user_id: userId } });
            const pontos = totalPointsResult || 0;

            // --- RANKING REAL ---
            const allScores = await GamificationLog.findAll({
                attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('points')), 'total_points']],
                group: ['user_id'],
                order: [[sequelize.fn('SUM', sequelize.col('points')), 'DESC']],
                raw: true
            });
            const userRankIndex = allScores.findIndex(score => score.user_id === userId);
            const ranking = userRankIndex !== -1 ? userRankIndex + 1 : allScores.length + 1;

            return {
                tempo_no_app: tempo_no_app || 0,
                metas_cumpridas: metas_cumpridas || 0,
                pontos: pontos,
                ranking: ranking,
                economia_total: 0, // Ajuste conforme sua logica de economia
                agua_poupada: agua_poupada
            };
        } catch (error) { throw error; }
    }

    // NOVO: getLeaderboard
    static async getLeaderboard() {
        try {
            const leaderboard = await GamificationLog.findAll({
                attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('points')), 'total_points']],
                include: [{ model: User, as: 'user', attributes: ['nickname'] }],
                group: ['user_id', 'user.id', 'user.nickname'],
                order: [[sequelize.fn('SUM', sequelize.col('points')), 'DESC']],
                limit: 5,
                raw: true,
                nest: true
            });
            return leaderboard.map((item, index) => ({
                posicao: index + 1,
                nickname: item.user.nickname || `Vizinho Anônimo ${index + 1}`,
                pontos: parseInt(item.total_points)
            }));
        } catch (error) { throw error; }
    }
}