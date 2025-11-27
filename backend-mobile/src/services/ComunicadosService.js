import Comunicados from "../models/Comunicados.js";
import ComunicadoLido from "../models/ComunicadoLido.js";
import { Op } from "sequelize";

export default class ComunicadosService {
    static async getAll(userId) {
        try {
            // Busca todos os comunicados para usuários
            const comunicados = await Comunicados.findAll({
                where: { addressee: 'usuários' },
                order: [['criado_em', 'DESC']]
            });

            // Busca os IDs dos comunicados que este usuário já leu
            const lidos = await ComunicadoLido.findAll({
                where: { user_id: userId },
                attributes: ['comunicado_id']
            });

            const lidosIds = lidos.map(l => l.comunicado_id);

            // Adiciona a flag 'lido' em cada comunicado
            const resultado = comunicados.map(c => ({
                id: c.id,
                title: c.title,
                subject: c.subject,
                criado_em: c.criado_em,
                lido: lidosIds.includes(c.id)
            }));

            return resultado;
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