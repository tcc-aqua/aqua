import SuporteController from "../controllers/SuporteController.js";

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
}