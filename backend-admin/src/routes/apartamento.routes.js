import ApartamentoController from "../controllers/ApartamentoController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function unidadeRoutes(fastify) {

    fastify.get('/',
        {
            schema: {
                summary: 'Todos os apartamentos',
                tags: ['apartamentos'],
                description: 'Listando todos os apartamentos do sistema'
            }
        }, ApartamentoController.getAll);

    fastify.get('/ativos',
        {
            schema: {
                summary: 'Todos os apartamentos ativo',
                tags: ['apartamentos'],
                description: 'Listando todos os apartamentos ativos do sistema'
            }
        }, ApartamentoController.getAllAtivos);

    fastify.get('/inativos',
        {
            schema: {
                summary: 'Todos os apartamentos inativos',
                tags: ['apartamentos'],
                description: 'Listando todos os apartamentos inativos do sistema'
            }
        },
        ApartamentoController.getAllInativos);

    fastify.get('/count',
        {
            schema: {
                summary: 'Contagem de apartamentos no sistema',
                tags: ['apartamentos'],
                description: 'Fazendo contagem de apartamentos no sistema'
            }
        }, ApartamentoController.count);

    fastify.patch('/:id/inativar',
        {
            schema: {
                summary: 'Inativando um apartamento',
                tags: ['apartamentos'],
                description: 'Inativando um apartamento especifico do sistema'
            },
            preHandler: autenticarAdmin
        }, ApartamentoController.inativar);

    fastify.patch('/:id/ativar',
        {
            schema: {
                summary: 'Ativando um apartamento',
                tags: ['apartamentos'],
                description: 'Ativando um apartamento especifico do sistema'
            },
            preHandler: autenticarAdmin
        }, ApartamentoController.ativar);

}