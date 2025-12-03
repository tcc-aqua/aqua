import Comunicados from "../models/Comunicados.js";
import ComunicadoLido from "../models/ComunicadoLido.js";
import User from "../models/User.js";
import { Op } from "sequelize";

export default class ComunicadosService {
    static async getAll(userId) {
        try {
            const user = await User.findByPk(userId);
            
            // Removemos 'status: ativo' do filtro
            const whereClause = {
                [Op.or]: [
                    { 
                        addressee: { [Op.in]: ['usuários', 'todos'] },
                        casa_id: null,
                        condominio_id: null
                    },
                    // Se o usuário tem casa, traz comunicados dessa casa
                    user.residencia_type === 'casa' ? { casa_id: user.residencia_id } : null,
                    // Se o usuário está em condomínio
                    user.residencia_type === 'apartamento' && user.residencia_id ? { condominio_id: await getCondominioId(user.residencia_id) } : null
                ].filter(Boolean)
            };

            const comunicados = await Comunicados.findAll({
                where: whereClause,
                order: [['criado_em', 'DESC']]
            });

            const lidos = await ComunicadoLido.findAll({
                where: { user_id: userId },
                attributes: ['comunicado_id']
            });
            const lidosIds = lidos.map(l => l.comunicado_id);

            return comunicados.map(c => ({
                id: c.id,
                title: c.title,
                subject: c.subject,
                criado_em: c.criado_em,
                lido: lidosIds.includes(c.id)
            }));

        } catch (error) {
            console.error('Erro ao listar comunicados', error);
            throw error;
        }
    }

    static async marcarComoLido(userId, comunicadoId) {
        try {
            const jaLido = await ComunicadoLido.findOne({
                where: { user_id: userId, comunicado_id: comunicadoId }
            });

            if (!jaLido) {
                await ComunicadoLido.create({
                    user_id: userId,
                    comunicado_id: comunicadoId,
                    lido: true
                });
            }
            return { message: 'Marcado como lido' };
        } catch (error) {
            console.error('Erro ao marcar comunicado', error);
            throw error;
        }
    }
}

// Helper para pegar ID do condomínio a partir do Apartamento
async function getCondominioId(aptoId) {
    const { default: Apartamento } = await import("../models/Apartamento.js");
    const apto = await Apartamento.findByPk(aptoId);
    return apto ? apto.condominio_id : null;
}
