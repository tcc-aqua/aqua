import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', {
        schema: {
            summary: 'Listar Usuários',
            description: 'Lista todos os usuários do sistema',
            tags: ['users'],
            description: 'List Users' ,
            
    
        }
    },   UserController.getAll
    );

    fastify.get('/ativos', UserController.getAllActives);
    fastify.get('/inativos', UserController.getAllDeactivated);
    fastify.get('/casa', UserController.getAllMoramEmCasa);
    fastify.get('/condominio', UserController.getAllMoramCondominio);
    fastify.get('/count', UserController.count);
    fastify.get('/count-ativos', UserController.countAtivos);
    fastify.get('/sindicos', UserController.countSindicos);
    fastify.get('/moradores', UserController.countMoradores);
    fastify.get('/moradores/casas', UserController.moradoresCasa);
    fastify.get('/moradores/apartamentos', UserController.moradoresApartamentos);
    fastify.get('/:id', UserController.getById);
    fastify.patch('/:id/inativar', UserController.deactivate);
    fastify.patch('/:id/ativar', UserController.ativar);
    fastify.patch('/:id/sindico', UserController.sindico);

}