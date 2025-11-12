import MetasController from "../controllers/MetasController.js";

export default async function metasRoutes(fastify) {
    fastify.get('/',
        {
            schema: {
                summary: 'Listando todas as metas do usuário',
                tags: ['metas'],
                description: 'Metas do usuário referente ao consumo.'
            }
        },
        MetasController.getAll);

    fastify.post('/', 
        {
            schema: {
                summary: 'Criando uma nova meta',
                tags: ['metas'],
                description: 'Criando uma nova meta referente ao consumo de água planejada durante determinado tempo'
            }
        },
        MetasController.create);
}