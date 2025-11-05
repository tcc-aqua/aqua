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
}