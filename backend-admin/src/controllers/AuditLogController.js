import AuditLogService from "../services/AuditLog.js";

export default class AuditLogController {

    static async getLogsRecentes(req, reply) {
        const { limit = 5 } = req.query;
        const logs = await AuditLogService.getLogsRecentes(Number(limit));

        return reply.send(logs);
    }

    static async getAllLogs(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const logs = await AuditLogService.getAllLogs(page, limit);
        return reply.send(logs);
    }

    static async getLogsByUser(req, reply) {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const logs = await AuditLogService.getLogsByUser(
            id,
            Number(page),
            Number(limit)
        );

        return reply.send(logs);
    }

    static async countLogs(req, reply) {
        const { acao } = req.query;
        const total = await AuditLogService.countLogs(acao || null);

        return reply.send(total);
    }

    static async countByAction(req, reply) {
        const results = await AuditLogService.countByAction();
        return reply.send(results);
    }

    static async searchByField(req, reply) {
        const { campo, valor, page = 1, limit = 10 } = req.query;

        if (!campo || !valor) {
            return reply.status(400).send({
                error: "Campos 'campo' e 'valor' são obrigatórios"
            });
        }

        const logs = await AuditLogService.searchByField(
            campo,
            valor,
            Number(page),
            Number(limit)
        );

        return reply.send(logs);
    }

    static async criarLog(req, reply) {
        const dados = req.body;

        const log = await AuditLogService.criarLog(dados);

        return reply.status(201).send(log);
    }
}
