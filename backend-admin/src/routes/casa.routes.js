import CasaController from "../controllers/CasaController.js";

export default async function casaRoutes(fastify) {

        fastify.get('/',
                {
                        schema: {
                                summary: 'Todas as casas do sistema',
                                tags: ['casas'],
                                description: 'Listando todas as casas do sistema'
                        }
                }, CasaController.getAll);

        fastify.get('/ativos',
                {
                        schema: {
                                summary: 'Todas as casas ativas do sistema',
                                tags: ['casas'],
                                description: 'Listando todas as casas ativas do sistema'
                        }
                }, CasaController.getAllAtivos);

        fastify.get('/inativos',
                {
                        schema: {
                                summary: 'Todas as casas inativas do sistema',
                                tags: ['casas'],
                                description: 'Listando todas as casas inativas do sistema'
                        }
                }, CasaController.getAllInativos);

        fastify.get('/count',
                {
                        schema: {
                                summary: 'Contagem de casas do sistema',
                                tags: ['casas'],
                                description: 'Fazendo contagem de casas do sistema'
                        }
                },
                CasaController.count);

        fastify.get('/count-ativas',
                {
                        schema: {
                                summary: 'Contagem de casas ativas do sistema',
                                tags: ['casas'],
                                description: 'Fazendo contagem de casas ativas do sistema'
                        }
                },
                CasaController.countAtivas);

        fastify.patch('/:id/ativar',
                {
                        schema: {
                                summary: 'Ativando uma casa',
                                tags: ['casas'],
                                description: 'Ativando uma casa inativada do sistema'
                        }
                },
                CasaController.ativar)

        fastify.patch('/:id/inativar',
                {
                        schema: {
                                summary: 'Inativando uma casa',
                                tags: ['casas'],
                                description: 'Inativando uma casa do sistema'
                        }
                },
                CasaController.inativar)
}