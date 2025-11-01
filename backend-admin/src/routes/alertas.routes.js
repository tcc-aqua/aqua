import AlertasController from "../controllers/AlertaController.js";

export default async function alertasRoutes(fastify) {

    fastify.get('/',
        {
            schema: {
                summary: 'Listando todos os alertas',
                tags: ['alertas'],
                description: 'Todos os alertas do sistema'
            }
        }, AlertasController.getAll);

    fastify.get('/ativos',
        {
            schema: {
                summary: 'Todos os alertas ativos',
                tags: ['alertas'],
                description: 'Listando todos os alertas ativos do sistema'
            }
        }, AlertasController.getAllAtivos);

    fastify.get('/inativos',
        {
            schema: {
                summary: 'Todos os alertas inativos',
                tags: ['alertas'],
                description: 'Listando todos os alertas inativos do sistema'
            }
        }, AlertasController.getAllInativos);

    fastify.get('/recentes',
        {
            schema: {
                summary: 'Os ultimos 5 alertas recentes',
                tags: ['alertas'],
                description: 'Listando os ultimos 5 alertas recentes do sistema'
            }
        }, AlertasController.getRecentes);

    fastify.get('/count/ativos',
        {
            schema: {
                summary: 'Contagem de alertas ativos',
                tags: ['alertas'],
                description: 'Contagem dos alertas ativos do sistema'
            }
        }, AlertasController.countAtivos);

    fastify.get('/count/vazamentos',
        {
            schema: {
                summary: 'Contagem de alertas por vazamento',
                tags: ['alertas'],
                description: 'Contagem de alertas por vazamento do sistema'
            }
        }, AlertasController.countVazamentos);

    fastify.get('/count/consumo-alto',
        {
            schema: {
                summary: 'Contagem de alertas por consumo alto',
                tags: ['alertas'],
                description: 'Contagem de alertas por consumo alto do sistema'
            }
        }, AlertasController.countConsumoAlto);

    fastify.get('/:id/count/casas',
        {
            schema: {
                summary: 'Contagem de alertas que pertecem a casas',
                tags: ['alertas'],
                description: 'Contagem de alertas que pertecem a casa'
            }
        }, AlertasController.countPorCasa);

    fastify.get('/:id/count/apartamentos',
        {
            schema: {
                summary: 'Contagem de alertas que pertecem a apartamentos',
                tags: ['alertas'],
                description: 'Contagem de alertas que pertecem a apartamentos do sistema'
            }
        }, AlertasController.countPorApartamento);

    fastify.get('/count/condominios',
        {
            schema: {
                summary: 'Contagem de alertas que pertecem a condominios',
                tags: ['alertas'],
                description: 'Contagem de alertas que pertecem a condominios do sistema'
            }

        }, AlertasController.countPorCondominio);
    fastify.patch('/:id',
        {
            schema: {
                summary: 'Resolver alertar',
                tags: ['alertas'],
                description: 'Resolvendo o alerta por ID, marcando como resolvido'
            }
        }, AlertasController.resolverAlerta);
}