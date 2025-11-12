import NotificationController from "../controllers/NotificationController.js";

export default async function notificationRoutes(fastify) {

  // Listar notificações de um admin
  fastify.get('/', {
    schema: {
      tags: ['Notificações'],
      summary: 'Listar notificações do admin',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              message: { type: 'string' },
              type: { type: 'string' },
              is_read: { type: 'boolean' },
              criado_em: { type: 'string' }
            }
          }
        }
      }
    }
  }, NotificationController.list);

  // Marcar como lida
  fastify.patch('/read', {
    schema: {
      tags: ['Notificações'],
      summary: 'Marcar notificação como lida',
      body: {
        type: 'object',
        required: ['notification_id'],
        properties: {
          notification_id: { type: 'integer' }
        }
      }
    }
  }, NotificationController.markAsRead);

  // Excluir notificação para o admin
  fastify.delete('/', {
    schema: {
      tags: ['Notificações'],
      summary: 'Excluir notificação para o admin',
      body: {
        type: 'object',
        required: ['notification_id'],
        properties: {
          notification_id: { type: 'integer' }
        }
      }
    }
  }, NotificationController.delete);

}
