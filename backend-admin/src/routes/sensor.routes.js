import SensorController from "../controllers/SensorController.js";

export default async function sensorRoutes(fastify) {

        fastify.get('/',
                {
                        schema: {
                                summary: 'Todos os sensores',
                                tags: ['sensores'],
                                description: 'Listando todos os sensores do sistema'
                        }
                },
                SensorController.getAll);

        fastify.get('/ativos',
                {
                        schema: {
                                summary: 'Todos os sensores ativos',
                                tags: ['sensores'],
                                description: 'Listando todos os sensores ativos do sistema'
                        }
                },
                SensorController.getAllAtivos);

        fastify.get('/inativos',
                {
                        schema: {
                                summary: 'Todos os sensores inativos',
                                tags: ['sensores'],
                                description: 'Listando todos os sensores inativos do sistema'
                        }
                },
                SensorController.getAllInativos);

        fastify.get('/count',
                {
                        schema: {
                                summary: 'Contagem de sensores',
                                tags: ['sensores'],
                                description: 'Contagem de sensores do sistema'
                        }
                },
                SensorController.count);

        fastify.get('/count-ativos',
                {
                        schema: {
                                summary: 'Contagem de sensores ativos',
                                tags: ['sensores'],
                                description: 'Contagem de sensores ativos do sistema'
                        }
                },
                SensorController.countAtivos);

        fastify.get('/consumo-total',
                {
                        schema: {
                                summary: 'Consumo total dos sensores',
                                tags: ['sensores'],
                                description: 'Listando o consumo total dos sensores do sistema'
                        }
                },
                SensorController.getConsumoTotalDosSensores);

        fastify.get('/consumo-total-casas',
                {
                        schema: {
                                summarya: 'Consumo total dos sensores que ficam em casa',
                                tags: ['sensores'],
                                description: 'Listando o consumo total de sensores do tipo casa do sistema'
                        }
                },
                SensorController.getConsumoTotalCasas);

        fastify.get('/consumo-total-apartamentos',
                {
                        schema: {
                                summary: 'Consumo total dos sensores que ficam em apartamento',
                                tags: ['sensores'],
                                description: 'Listando o consumo total de sensores do tipo apartamento do sistema'
                        }
                },
                SensorController.getConsumoTotalApartamentos);

        fastify.patch('/:id/inativar',
                {
                        schema: {
                                summary: 'Inativando sensor',
                                tags: ['sensores'],
                                description: 'Inativando um sensor do sistema'
                        }
                },
                SensorController.inativar);
        fastify.patch('/:id/ativar',
                {
                        schema: {
                                summary: 'Ativando sensor',
                                tags: ['sensores'],
                                description: 'Ativando um sensor do sistema'
                        }
                },
                SensorController.ativar);
}