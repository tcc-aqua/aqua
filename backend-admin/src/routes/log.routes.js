import AuditLogController from "../controllers/AuditLogController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function auditLogRoutes(fastify) {

    fastify.get('/recentes',
        {
            schema: {
                summary: 'Listar últimos logs do sistema',
                tags: ['logs'],
                description: 'Retorna os últimos logs do sistema, ordenados por data de alteração',
                querystring: {
                    type: 'object',
                    properties: {
                        limit: { type: 'integer', default: 5 }
                    }
                }
            }
        },
        AuditLogController.getLogsRecentes
    );

    fastify.get('/',
        {
            schema: {
                summary: 'Listar todos os logs paginados',
                tags: ['logs'],
                description: 'Retorna todos os logs do sistema com paginação',
            },
        },
        AuditLogController.getAllLogs
    );

    fastify.get('/usuario/:id',
        {
            schema: {
                summary: 'Listar logs de um usuário específico',
                tags: ['logs'],
                description: 'Retorna os logs de um usuário, paginados',
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do usuário' }
                    },
                    required: ['id']
                },
                querystring: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', default: 1 },
                        limit: { type: 'integer', default: 10 }
                    }
                }
            }
        },
        AuditLogController.getLogsByUser
    );

    fastify.get('/count',
        {
            schema: {
                summary: 'Contagem total de logs',
                tags: ['logs'],
                description: 'Conta o total de logs, opcionalmente filtrando por ação',
                querystring: {
                    type: 'object',
                    properties: {
                        acao: { type: 'string', description: 'Filtra logs pela ação (create, update, delete)' }
                    }
                }
            }
        },
        AuditLogController.countLogs
    );

    fastify.get('/count/acao',
        {
            schema: {
                summary: 'Contagem de logs agrupados por ação',
                tags: ['logs'],
                description: 'Retorna a contagem de logs agrupados por tipo de ação'
            }
        },
        AuditLogController.countByAction
    );

    fastify.get('/search',
        {
            schema: {
                summary: 'Buscar logs por campo',
                tags: ['logs'],
                description: 'Permite buscar logs filtrando por campo e valor',
                querystring: {
                    type: 'object',
                    properties: {
                        campo: { type: 'string', description: 'Nome do campo a buscar' },
                        valor: { type: 'string', description: 'Valor a ser buscado' },
                        page: { type: 'integer', default: 1 },
                        limit: { type: 'integer', default: 10 }
                    },
                    required: ['campo', 'valor']
                }
            }
        },
        AuditLogController.searchByField
    );

    fastify.post('/',
        {
            schema: {
                summary: 'Criar log manualmente',
                tags: ['logs'],
                description: 'Cria um registro de log manualmente',
                body: {
                    type: 'object',
                    properties: {
                        user_id: { type: 'string', description: 'ID do usuário afetado' },
                        acao: { type: 'string', description: 'Ação realizada (create, update, delete)' },
                        campo: { type: 'string', description: 'Campo alterado' },
                        valor_antigo: { type: 'string', description: 'Valor anterior' },
                        valor_novo: { type: 'string', description: 'Novo valor' },
                        alterado_por: { type: 'string', description: 'ID do admin que realizou a alteração' }
                    },
                    required: ['user_id', 'acao', 'campo', 'alterado_por']
                }
            }
        },
        AuditLogController.criarLog
    );
}
