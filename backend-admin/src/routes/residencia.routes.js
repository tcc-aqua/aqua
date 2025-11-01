import ResidenciaController from "../controllers/ResidenciaController.js";

export default async function residenciaRoutes(fastify) {

    fastify.get('/',
        {
            schema: {
                summary: 'Total de residencias no sistema',
                tags: ['residencias'],
                description: 'Listando o total de residencias cadastrado no sistema'
            }
        },
        ResidenciaController.getAll);

    fastify.get('/estados',
        {
            schema: {
                summary: "Listando o total de residencias por estado",
                tags: ['residencias'],
                description: 'Listando o total de residencias por estado cadastrado no sistema'
            }
        },
        ResidenciaController.getPorEstado);
}