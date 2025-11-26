import SuporteController from "../controllers/SuporteController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function suporteRoutes(fastify) {

    fastify.get('/',
        {
            schema: {
                summary: 'Listando todas as mensagens de clientes para a administração',
                tags: ['suporte'],
                description: 'Listando todas as mensagens'
            }
        }, SuporteController.getAll);

    fastify.post('/',
        {
            schema: {
                summary: 'Respondendo mensagem de cliente',
                tags: ['suporte'],
                description: 'Enviando mensagem para o cliente'
            }
        }, SuporteController.enviarMensagem);

    fastify.delete('/:id', { preHandler: autenticarAdmin }, SuporteController.deletarMensagem);


    fastify.patch(
        '/:id/visualizado',
        {
            schema: {
                summary: 'Marcar mensagem como visualizada',
                tags: ['suporte'],
                description: 'Marca a mensagem como visualizada pelo usuário'
            }
        },
        SuporteController.marcarComoVisualizada
    );
}