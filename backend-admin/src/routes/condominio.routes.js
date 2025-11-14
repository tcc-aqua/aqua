import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify) {

    fastify.get('/',
        {
            schema: {
                summary: 'Todos os condominios do sistema',
                tags: ['condominios'],
                description: 'Listando todos os condominios do sistema'
            }
        },
        CondominioController.getAll);

    fastify.get('/ativos',
        {
            schema: {
                summary: 'Todos os condominios ativos do sistema',
                tags: ['condominios'],
                description: 'Listando todos os condominios ativos do sistema'
            }
        },
        CondominioController.getAllActives);

    fastify.get('/inativos',
        {
            schema: {
                summary: 'Todos os condominios inativos do sistema',
                tags: ['condominios'],
                description: 'Listando todos os condominios inativos do sistema'
            }
        },
        CondominioController.getAllInativos);

    fastify.get('/count',
        {
            schema: {
                summary: 'Contagem de condominios do sistema',
                tags: ['condominios'],
                description: 'Fazendo contagem de condominios do sistema'
            }
        },
        CondominioController.count);

    fastify.get('/:id/apartamentos',
        {
            schema: {
                summary: 'Listar a quantidade de apartamentos de um condominio especifico',
                tags: ['condominios'],
                description: 'Fazendo contagem de apartamentos do condominio'
            }
        },
        CondominioController.listarQtdApartamentos);

    fastify.post('/',
        {
            schema: {
                summary: 'Cadastrando um novo condominio',
                tags: ['condominios'],
                description: 'Criando um novo condominio no sistema'
            }
        },
        CondominioController.create);

    fastify.put('/:id',
        {
            schema: {
                summary: 'Atualizando cadastro de um condominio',
                tags: ['condominios'],
                description: 'Atualizando informações de um condominio do sistema'
            }
        },
        CondominioController.update);

    fastify.put('/:id/name',
        {
            schema: {
                summary: 'Atualizando cadastro do nome de um condominio',
                tags: ['condominios'],
                description: 'Atualizando informações de um condominio do sistema'
            }
        },
        CondominioController.updateName);

    fastify.patch('/:id/sindico',
        {
            schema: {
                summary: 'Atribuindo um sindico para o condominio',
                tags: ['condominios'],
                description: 'Aualizando o sindico do condominio'
            }
        },
        CondominioController.atribuirSindico);

    fastify.patch('/:id/inativar', 
        {
            schema: {
                summary: 'Inativando um condominio',
                tags: ['condominios'],
                description: 'Inativando um condominio do sistema'
            }
        },
        CondominioController.inativar);

    fastify.patch('/:id/ativar',
        {
            schema: {
                summary: 'Ativando um condominio',
                tags: ['condominios'],
                description: 'Ativando um condominio do sistema'
            }
        },
        CondominioController.ativar);
}