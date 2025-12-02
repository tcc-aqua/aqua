import Metas from "../models/Metas.js";
import User from "../models/User.js";
import Casa from "../models/Casa.js";
import Apartamento from "../models/Apartamento.js";
import LeituraSensor from "../models/LeituraSensor.js";
import { Op } from "sequelize";

export default class MetasService {

    static async getAllMetas(userId, page = 1, limit = 10) {
        try {
            const user = await User.findByPk(userId, {
                include: [
                    { model: Casa, as: 'casa' },
                    { model: Apartamento, as: 'apartamento' }
                ]
            });

            if (!user) throw new Error("Usuário não encontrado");

            const sensorId = user.residencia_type === 'casa' 
                ? user.casa?.sensor_id 
                : user.apartamento?.sensor_id;

            const offset = (page - 1) * limit;
            
            const { count, rows: metas } = await Metas.findAndCountAll({
                where: { user_id: userId },
                order: [
                    ['is_principal', 'DESC'], 
                    ['criado_em', 'DESC']
                ],
                limit,
                offset,
            });

            const updatedMetas = await Promise.all(metas.map(async (meta) => {
                let consumoCalculado = 0;

                if (sensorId) {
                    const total = await LeituraSensor.sum('consumo', {
                        where: {
                            sensor_id: sensorId,
                            data_registro: {
                                [Op.between]: [meta.inicio_periodo, meta.fim_periodo]
                            }
                        }
                    });
                    consumoCalculado = total || 0;
                }

                const limite = parseFloat(meta.limite_consumo);
                const atual = parseFloat(consumoCalculado);
                const hoje = new Date();
                const fim = new Date(meta.fim_periodo);
                let novoStatus = meta.status;

                if (atual > limite) {
                    novoStatus = 'excedida';
                } else if (hoje > fim && atual <= limite) {
                    novoStatus = 'atingida';
                } else if (hoje <= fim && atual <= limite) {
                    novoStatus = 'em_andamento';
                }

                if (parseFloat(meta.consumo_atual) !== atual || meta.status !== novoStatus) {
                    await meta.update({
                        consumo_atual: atual,
                        status: novoStatus
                    });
                    meta.consumo_atual = atual;
                    meta.status = novoStatus;
                }

                return meta;
            }));

            return {
                docs: updatedMetas,
                total: count,
                pages: Math.ceil(count / limit)
            };

        } catch (error) {
            console.error('Erro ao listar metas', error);
            throw error;
        }
    }

    static async createMeta({ userId, data }) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error("Usuário não encontrado");
            if (!user.residencia_id) throw new Error("Usuário sem residência vinculada");

            const { periodo, limite_consumo } = data;
            const inicio_periodo = new Date();
            const fim_periodo = new Date();

            switch (periodo) {
                case '7 dias': fim_periodo.setDate(inicio_periodo.getDate() + 7); break;
                case '14 dias': fim_periodo.setDate(inicio_periodo.getDate() + 14); break;
                case '30_dias': fim_periodo.setDate(inicio_periodo.getDate() + 30); break;
                default: fim_periodo.setDate(inicio_periodo.getDate() + 7);
            }

            const count = await Metas.count({ where: { user_id: userId } });
            const is_principal = count === 0;

            const meta = await Metas.create({ 
                user_id: userId,
                residencia_id: user.residencia_id, 
                residencia_type: user.residencia_type, 
                periodo, 
                limite_consumo, 
                consumo_atual: 0,
                inicio_periodo,
                fim_periodo,
                status: 'em_andamento',
                is_principal
            });

            return meta;
        } catch (error) {
            console.error("Erro ao criar meta", error);
            throw error;
        }
    }

    static async setPrincipal(metaId, userId) {
        const meta = await Metas.findOne({ where: { id: metaId, user_id: userId } });
        if (!meta) throw new Error("Meta não encontrada.");

        await Metas.update({ is_principal: false }, { where: { user_id: userId } });

        await meta.update({ is_principal: true });

        return meta;
    }

    static async updateMeta(id, userId, data) {
        const meta = await Metas.findOne({ where: { id, user_id: userId } });
        if (!meta) throw new Error("Meta não encontrada ou permissão negada.");

        if (data.limite_consumo) {
            const novoLimite = parseFloat(data.limite_consumo);
            const atual = parseFloat(meta.consumo_atual);
            
            if (atual > novoLimite) data.status = 'excedida';
            else if (new Date() > new Date(meta.fim_periodo)) data.status = 'atingida';
            else data.status = 'em_andamento';
        }

        await meta.update(data);
        return meta;
    }

    static async deleteMeta(id, userId) {
        const meta = await Metas.findOne({ where: { id, user_id: userId } });
        if (!meta) throw new Error("Meta não encontrada ou permissão negada.");
        
        const wasPrincipal = meta.is_principal;
        
        await meta.destroy();

        if (wasPrincipal) {
            const latest = await Metas.findOne({ 
                where: { user_id: userId }, 
                order: [['criado_em', 'DESC']] 
            });
            if (latest) {
                await latest.update({ is_principal: true });
            }
        }
        
        return true;
    }
}