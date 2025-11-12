import NotificationController from "../controllers/NotificationController.js";

export default async function notificationRoutes(fastify) {

    // socket io criando a notificação
    fastify.post('/', {
        schema: {
            tags: ['Notificações'],
            summary: 'Criar notificação',
            body: {
                type: 'object',
                required: ['sender_id', 'type', 'title', 'message'],
                properties: {
                    sender_id: { type: 'string' },
                    type: { type: 'string', enum: ['mensagem', 'alerta'] },
                    title: { type: 'string' },
                    message: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    example: {
                        id: 1,
                        user_id: "abc-123",
                        type: "mensagem",
                        title: "Nova mensagem",
                        message: "Teste",
                        criado_em: "2025-11-12T15:00:00Z"
                    }
                }
            }
        }
    }, NotificationController.create);
}