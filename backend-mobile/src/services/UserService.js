import { Op } from 'sequelize';
import User from "../models/User.js";
import Metas from "../models/Metas.js";
import LeituraSensor from '../models/LeituraSensor.js';
import Casa from '../models/Casa.js';
import Apartamento from '../models/Apartamento.js';
import sequelize from '../config/sequelize.js';

const PRECO_POR_LITRO = 0.015;
const PONTOS_POR_META = 50;

export default class UserService {
    static async getWeeklyConsumption(userId) {
        try {
            const user = await User.findByPk(userId, {
                include: [
                    { model: Casa, as: 'casa' },
                    { model: Apartamento, as: 'apartamento' }
                ]
            });

            if (!user) throw new Error('Usuário não encontrado');

            const sensorId = user.residencia_type === 'casa'
                ? user.casa?.sensor_id
                : user.apartamento?.sensor_id;

            if (!sensorId) {
                return [];
            }

            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            seteDiasAtras.setHours(0, 0, 0, 0);

            const leituras = await LeituraSensor.findAll({
                where: {
                    sensor_id: sensorId,
                    data_registro: {
                        [Op.gte]: seteDiasAtras
                    }
                },
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('data_registro')), 'data_leitura'],
                    [sequelize.fn('SUM', sequelize.col('consumo')), 'total_litros']
                ],
                group: [sequelize.fn('DATE', sequelize.col('data_registro'))],
                order: [[sequelize.fn('DATE', sequelize.col('data_registro')), 'ASC']],
                raw: true
            });

            const dadosFormatados = leituras.map(item => {
                let dataString = item.data_leitura;

                if (dataString instanceof Date) {
                    dataString = dataString.toISOString().split('T')[0];
                }

                const [ano, mes, dia] = dataString.toString().split('-');

                return {
                    data: `${dia}/${mes}`,
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
                'name', 'email', 'cpf', 'password'
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

            const buffer = await file.toBuffer();
            const mimetype = file.mimetype;
            
            const base64Image = `data:${mimetype};base64,${buffer.toString('base64')}`;

            user.img_url = base64Image;
            await user.save();

            return base64Image;
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

            const pontos = metas_cumpridas * PONTOS_POR_META;

            const ranking = 1; 

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