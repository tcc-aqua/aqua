import DicaController from "../controllers/DicaController.js";

export default async function dicaRoutes(fastify){
    fastify.get('/', 
        {
            schema: {
                summary: 'API GEMINI do qual destaca uma dica do dia para economizar',
                tags: ['dica-do-dia'],
                description: 'Dica do dia para o usuário'
            }
        },
        DicaController.getDicaDoDia);
}