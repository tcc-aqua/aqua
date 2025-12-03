import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify) {
    fastify.post('/', {
        schema: {
            summary: 'Registrar novo condomínio',
            tags: ['condominios'],
            description: 'Cria um novo condomínio e o usuário síndico responsável.'
        }
    }, CondominioController.create);

    fastify.get('/', {
        schema: {
            summary: 'Listar condomínios',
            tags: ['condominios'],
            description: 'Lista todos os condomínios cadastrados.'
        }
    }, CondominioController.getAll);
}