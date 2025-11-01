import AdminController from "../controllers/AdminController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function adminRoutes(fastify) {

        fastify.get('/',
                {
                        schema: {
                                summary: 'Listando todos os admins do sistema',
                                tags: ['administradores'],
                                description: 'Listar admis'
                        }
                }, AdminController.getAll);

        fastify.get('/ativos',
                {
                        schema: {
                                summary: 'Listando todos os administadores ativos do sistema',
                                tags: ['administradores'],
                                description: 'Listar administradores ativos'
                        }
                }, AdminController.getAllAtivos);

        fastify.get('/inativos',
                {
                        schema: {
                                summary: 'Listando todos os administradores inativos do sistema',
                                tags: ['administradores'],
                                description: 'Listar administradores inativos'
                        }
                }, AdminController.getAllInativos);

        fastify.post('/',
                {
                        schema: {
                                summary: 'Criando novo administrador',
                                tags: ['administradores'],
                                description: 'Criando novo administrador para o sistema com o valor default de admin'
                        }
                }, AdminController.create);

        fastify.put('/:id', {
                schema: {
                        summary: 'Atualizando email de um administrador',
                        tags: ['administradores'],
                        description: 'Superadmin atualizando cadastro de um admin comum'
                }
        }, AdminController.update);

        fastify.patch('/:id/inativar', {
                schema: {
                        summary: 'Inativando um administrador',
                        tags: ['administradores'],
                        description: 'Inativando um administrador'
                }
        }, AdminController.inativar);

        fastify.patch('/:id/ativar',
                {
                        schema: {
                                summary: 'Ativando um administrador',
                                tags: ['administradores'],
                                description: 'Ativando um administrador'
                        }
                }, AdminController.ativar);

        fastify.patch('/me',
                {
                        schema: {
                                summary: 'Get de informações do administrador conectado via token',
                                tags: ['administradores'],
                                description: 'Get do administrador'
                        },
                        preHandler: autenticarAdmin
                },
                AdminController.updatePassword
        );

}