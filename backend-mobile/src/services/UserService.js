// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\services\UserService.js

import { Op } from 'sequelize';
import User from "../models/User.js";
import Metas from "../models/Metas.js";
import LeituraSensor from '../models/LeituraSensor.js';
import Casa from '../models/Casa.js';
import Apartamento from '../models/Apartamento.js';
import GamificationService from './GamificationService.js';
import sequelize from '../config/sequelize.js';
import GamificationLog from '../models/GamificationLog.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRECO_POR_LITRO = 0.015;

export default class UserService {
    static async getWeeklyConsumption(userId) {
        try {
            // 1. Busca usuário para descobrir tipo de residência e sensor
            const user = await User.findByPk(userId, {
                include: [
                    { model: Casa, as: 'casa' },
                    { model: Apartamento, as: 'apartamento' }
                ]
            });

            if (!user) throw new Error('Usuário não encontrado');

            // 2. Identifica o ID do sensor
            const sensorId = user.residencia_type === 'casa'
                ? user.casa?.sensor_id
                : user.apartamento?.sensor_id;

            if (!sensorId) {
                // Se não tiver sensor, retorna lista vazia
                return [];
            }

            // 3. Define data de 7 dias atrás
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            seteDiasAtras.setHours(0, 0, 0, 0);

            // 4. Consulta Agrupada: Soma consumo por dia
            const leituras = await LeituraSensor.findAll({
                where: {
                    sensor_id: sensorId,
                    data_registro: {
                        [Op.gte]: seteDiasAtras // >= 7 dias atrás
                    }
                },
                attributes: [
                    // SQL: DATE(data_registro)
                    [sequelize.fn('DATE', sequelize.col('data_registro')), 'data_leitura'],
                    // SQL: SUM(consumo)
                    [sequelize.fn('SUM', sequelize.col('consumo')), 'total_litros']
                ],
                group: [sequelize.fn('DATE', sequelize.col('data_registro'))],
                order: [[sequelize.fn('DATE', sequelize.col('data_registro')), 'ASC']],
                raw: true
            });

            // 5. Formata para o padrão esperado pelo Gráfico (DD/MM e Number)
            const dadosFormatados = leituras.map(item => {
                let dataString = item.data_leitura;

                // Garante que é uma string no formato YYYY-MM-DD
                // (Caso o driver do MySQL retorne um objeto Date)
                if (dataString instanceof Date) {
                    dataString = dataString.toISOString().split('T')[0];
                }

                // Agora dataString é certeza "2025-12-01"
                const [ano, mes, dia] = dataString.toString().split('-');

                return {
                    data: `${dia}/${mes}`, // Retorna "01/12"
                    consumo: parseFloat(item.total_litros)
                };
            });

            return dadosFormatados;

        } catch (error) {
            console.error('Erro ao buscar consumo semanal:', error);
            throw error;
        }
    }
    static async updateMe(userId, data) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Usuário não encontrado');

            const allowedUpdates = [
                'name', 'email', 'cpf', 'password',
                'notif_vazamento', 'notif_consumo_alto', 'notif_metas',
                'notif_comunidade', 'notif_relatorios'
            ];

            const updateData = {};
            for (const key of allowedUpdates) {
                if (data[key] !== undefined && data[key] !== '') {
                    updateData[key] = data[key];
                }
            }

            await user.update(updateData);
            return user;
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
            throw error;
        }
    }

    static async uploadProfilePicture(userId, file) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('Usuário não encontrado');

            // --- CORREÇÃO DO CAMINHO ---
            // __dirname aqui é .../src/services
            // Precisamos subir 2 niveis (services -> src -> raiz)
            const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

            console.log('------------------------------------------------');
            console.log('💾 SALVANDO IMAGEM EM:', uploadDir);
            console.log('------------------------------------------------');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Gera nome único
            const fileName = `user-${userId}-${Date.now()}-${file.filename.replace(/\s/g, '')}`;
            const filePath = path.join(uploadDir, fileName);

            const buffer = await file.toBuffer();
            await fs.promises.writeFile(filePath, buffer);

            const fileUrl = `/api/uploads/${fileName}`;
            user.img_url = fileUrl;
            await user.save();

            return fileUrl;
        } catch (error) {
            console.error('Erro ao salvar foto de perfil do usuário', error);
            throw new Error('Erro interno ao processar a imagem.');
        }
    }

    static async getUserStats(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: [
                    { model: Casa, as: 'casa' },
                    { model: Apartamento, as: 'apartamento' }
                ]
            });
            if (!user) throw new Error('Usuário não encontrado');

            const hoje = new Date();
            const dataCriacao = new Date(user.criado_em);
            const diffTime = Math.abs(hoje - dataCriacao);
            const tempo_no_app = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const metas_cumpridas = await Metas.count({
                where: { user_id: userId, status: 'atingida' }
            });

            let agua_poupada = 0;
            const metasAtingidas = await Metas.findAll({ where: { user_id: userId, status: 'atingida' } });

            const sensorId = user.residencia_type === 'casa' ? user.casa?.sensor_id : user.apartamento?.sensor_id;

            if (sensorId) {
                for (const meta of metasAtingidas) {
                    const consumoNoPeriodo = await LeituraSensor.sum('consumo', {
                        where: {
                            sensor_id: sensorId,
                            data_registro: { [Op.between]: [meta.inicio_periodo, meta.fim_periodo] }
                        }
                    });
                    const economia = parseFloat(meta.limite_consumo) - (consumoNoPeriodo || 0);
                    if (economia > 0) {
                        agua_poupada += economia;
                    }
                }
            }

            const economia_total = agua_poupada * PRECO_POR_LITRO;

            const pontos = await GamificationService.calculateTotalPoints(userId);

            const userScores = await GamificationLog.findAll({
                attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('points')), 'total_points']],
                group: ['user_id'],
                order: [[sequelize.fn('SUM', sequelize.col('points')), 'DESC']],
                raw: true
            });

            const userRankIndex = userScores.findIndex(score => score.user_id === userId);
            const ranking = userRankIndex !== -1 ? userRankIndex + 1 : userScores.length + 1;

            return {
                tempo_no_app: tempo_no_app || 0,
                metas_cumpridas: metas_cumpridas || 0,
                pontos: pontos || 0,
                ranking: ranking || 0,
                economia_total: parseFloat(economia_total.toFixed(2)) || 0,
                agua_poupada: parseFloat(agua_poupada.toFixed(2)) || 0
            };

        } catch (error) {
            console.error('Erro ao buscar estatísticas do usuário', error);
            throw error;
        }
    }
}