import CrescimentoController from "../controllers/CrescimentoController.js";

export default async function crescimentoRoutes(fastify){
    fastify.get('/', 
        {
            schema: {
                summary: 'Listando todo o crescimento',
                tags: ['crescimento'],
                description: 'view para grafico de crescimento de usuarios'
            }
        },
        CrescimentoController.get);
}