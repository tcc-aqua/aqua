import UserController from "../controllers/UserController.js";

export default async function userRoutes(fastify) {

    fastify.get('/', {
        schema: {
            description: 'Lista todos os usuários do sistema',
            tags: ['Users'],
            response: {
                200: {
                    description: 'Lista de usuários retornada com sucesso',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'UUID do usuário' },
                            name: { type: 'string', description: 'Nome completo' },
                            email: { type: 'string', description: 'E-mail do usuário' },
                            cpf: { type: 'string', description: 'CPF no formato 000.000.000-00' },
                            type: { type: 'string', enum: ['casa', 'condominio'], description: 'Tipo de moradia' },
                            role: { type: 'string', enum: ['morador', 'sindico'], description: 'Função do usuário' },
                            status: { type: 'string', enum: ['ativo', 'inativo'], description: 'Status da conta' },
                            residencia_type: { type: 'string', enum: ['casa', 'apartamento'], description: 'Tipo da residência' },
                            criado_em: { type: 'string', format: 'date-time', description: 'Data de criação' },
                            atualizado_em: { type: 'string', format: 'date-time', description: 'Última atualização' }
                        },
                        required: ['id', 'name', 'email', 'cpf', 'type', 'role', 'status']
                    }
                }
            }
        }
    }, UserController.getAll);

    fastify.get('/ativos', UserController.getAllActives);
    fastify.get('/inativos', UserController.getAllDeactivated);
    fastify.get('/casa', UserController.getAllMoramEmCasa);
    fastify.get('/condominio', UserController.getAllMoramCondominio);
    fastify.get('/count', UserController.count);
    fastify.get('/count-ativos', UserController.countAtivos);
    fastify.get('/count-sindicos', UserController.countSindicos);
    fastify.get('/count-moradores', UserController.countMoradores);
    fastify.get('/:id', UserController.getById);
    fastify.patch('/:id/inativar', UserController.deactivate);
    fastify.patch('/:id/ativar', UserController.ativar);

}