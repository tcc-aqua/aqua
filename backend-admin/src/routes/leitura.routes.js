import LeituraSensorController from "../controllers/LeituraSensor.js";

export default async function leituraRoutes(fastify){

    fastify.get('/',
        {
            schema: {
                summary: 'Leitura dos sensores',
                tags: ['leitura-sensores'],
                description: 'Leitura de todos os sensores do sistema.'
            }
        },
        LeituraSensorController.getAll);

}