import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', {
        schema: {
            summary: 'Listar Usuários',
            description: 'Lista todos os usuários do sistema',
            tags: ['usuários'],
            description: 'List Users',
        }
    }, UserController.getAll);

    fastify.get('/ativos',
        {
            schema: {
                summary: 'Listar Usuários ativos',
                tags: ['usuários'],
                description: "Listando todos os usuários ativos do sistema",
            }
        }, UserController.getAllActives);

    fastify.get('/inativos',
        {
            schema: {
                summary: 'Listar Usuários inativos',
                tags: ['usuários'],
                description: "Listando todos os usuários inativos do sistema",
            }
        }, UserController.getAllDeactivated);


    fastify.get('/casa',
        {
            schema: {
                summary: 'Listando Usuários que moram em uma casa',
                tags: ['usuários'],
                description: "Listando todos os usuários do tipo 'casa' do sistema"
            }
        }, UserController.getAllMoramEmCasa);

    fastify.get('/condominio',
        {
            schema: {
                summary: 'Listando Usuários que moram em condominio',
                tags: ['usuários'],
                description: "Listando todos os usuários do tipo condominio do sistema"
            }
        }, UserController.getAllMoramCondominio);

    fastify.get('/count', {
        schema: {
            summary: 'Fazendo contagem de usuários do sistema',
            tags: ['usuários'],
            description: "Contagem de usuários do sistema",
        }
    }, UserController.count);

    fastify.get('/count-ativos',
        {
            schema: {
                summary: 'Fazendo contagem de usuários ativos do sistema',
                tags: ['usuários'],
                description: "Contagem de usuários ativos do sistema",
            }
        }, UserController.countAtivos);

    fastify.get('/sindicos', {
        schema: {
            summary: 'Listando todos os sindicos do sistema',
            tags: ['usuários'],
            description: "Sindicos do sistema",
        }
    }, UserController.getAllSindicos);

    fastify.get('/count/sindicos', {
        schema: {
            summary: 'Fazendo contagem de sindicos do sistema',
            tags: ['usuários'],
            description: "Contagem de sindicos do sistema",
        }
    }, UserController.countSindicos);

    fastify.get('/moradores', {
        schema: {
            summary: 'Fazendo contagem de moradores do sistema',
            tags: ['usuários'],
            description: "Contagem de moradores do sistema",
        }
    }, UserController.countMoradores);

    fastify.get('/moradores/casas',
        {
            schema: {
                summary: "Fazendo contagem de moradores do sistema que são do tipo casa",
                tags: ['usuários'],
                description: "Contagem de moradores do sistema",
            }
        }, UserController.moradoresCasa);


    fastify.get('/moradores/apartamentos',
        {
            schema: {
                summary: "Fazendo contagem de moradores do sistema que moram em apartamento",
                tags: ['usuários'], 
                description: "Contagem de moradores de apto do sistema",
            }
        }, UserController.moradoresApartamentos);

    fastify.get('/:id', {
        schema: {
            summary: 'Get de um user pelo Id',
            tags: ['usuários'],
            description: "puxando dados do usuário pelo id",
        }
    }, UserController.getById);

    fastify.patch('/:id/inativar',
        {
            schema: {
                summary: 'Inativando o usuário',
                tags: ['usuários'],
                description: "Inativando o usuário pelo id no sistema",
            }
        }, UserController.deactivate);

    fastify.patch('/:id/ativar',
        {
            schema: {
                summary: "Ativando o usuário",
                tags: ['usuários'],
                description: "Ativando o usuário pelo ID no sistema",
            }
        }, UserController.ativar);

    fastify.patch('/:id/sindico',
        {
            schema: {
                summary: "Tornando um usuário comum em sindico",
                tags: ['usuários'],
                description: "Atribuindo como sindico",
            }
        }, UserController.sindico);
}