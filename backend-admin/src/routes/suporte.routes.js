import SuporteController from "../controllers/SuporteController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function suporteRoutes(fastify) {

    fastify.get('/',
        {
            preHandler: autenticarAdmin,
            schema: {
                summary: 'Listando todas as mensagens enviadas ao suporte',
                tags: ['suporte'],
                description: 'Lista todas as mensagens enviadas por usuários ou admins'
            }
        }, SuporteController.getAll);


    fastify.post('/',
        {
            preHandler: autenticarAdmin,
            schema: {
                summary: 'Enviar mensagem (admin)',
                tags: ['suporte'],
                description: 'Admin envia mensagem para usuários, síndicos ou administrativos'
            }
        }, SuporteController.enviarMensagem);


    fastify.post('/responder',
        {
            preHandler: autenticarAdmin,
            schema: {
                summary: 'Responder mensagem (admin)',
                tags: ['suporte'],
                description: 'Admin responde uma mensagem enviada por um usuário'
            }
        }, SuporteController.responderMensagem);


    fastify.delete('/:id',
        {
            preHandler: autenticarAdmin,
            schema: {
                summary: 'Deletar mensagem (admin)',
                tags: ['suporte'],
                description: 'Admin deleta uma mensagem'
            }
        }, SuporteController.deletarMensagem);
}
