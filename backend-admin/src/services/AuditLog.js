import { fn, col, Op } from "sequelize";
import UsersLog from "../models/UserLog.js";

export default class AuditLogService {

    static async getLogsRecentes(limit = 5) {
        try {
            const logs = await UsersLog.findAll({
                limit,
                order: [['alterado_em', 'DESC']]
            });
            return logs;
        } catch (error) {
            console.error('Erro ao listar logs recentes', error);
            throw error;
        }
    }

    static async getAllLogs(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['alterado_em', 'DESC']]
            };

            const logs = await UsersLog.paginate(options);
            return logs;
        } catch (error) {
            console.error('Erro ao listar todos os logs', error);
            throw error;
        }
    }

    static async getLogsByUser(userId, page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['alterado_em', 'DESC']],
                where: { user_id: userId }
            };

            const logs = await UsersLog.paginate(options);
            return logs;
        } catch (error) {
            console.error(`Erro ao listar logs do usuário ${userId}`, error);
            throw error;
        }
    }

    static async countLogs(acao = null) {
        try {
            const where = {};
            if (acao) where.acao = acao;

            const total = await UsersLog.count({ where });
            return { totalLogs: total };
        } catch (error) {
            console.error('Erro ao contar logs', error);
            throw error;
        }
    }

    static async countByAction() {
        try {
            const resultados = await UsersLog.findAll({
                attributes: [
                    'acao',
                    [fn('COUNT', col('id')), 'total']
                ],
                group: ['acao'],
                order: [[fn('COUNT', col('id')), 'DESC']]
            });

            return resultados.map(r => ({
                acao: r.acao,
                total: Number(r.getDataValue('total'))
            }));
        } catch (error) {
            console.error('Erro ao contar logs por ação', error);
            throw error;
        }
    }

    static async searchByField(campo, value, page = 1, limit = 10) {
        try {
            const where = {};
            where[campo] = { [Op.like]: `%${value}%` };

            const options = {
                page,
                paginate: limit,
                order: [['alterado_em', 'DESC']],
                where
            };

            const logs = await UsersLog.paginate(options);
            return logs;
        } catch (error) {
            console.error(`Erro ao buscar logs por campo ${campo}`, error);
            throw error;
        }
    }

    static async criarLog(dados) {
        try {
            const log = await UsersLog.create(dados);
            return log;
        } catch (error) {
            console.error('Erro ao criar log', error);
            throw error;
        }
    }

}
