import AdminController from "../controllers/AdminController.js";

export default async function adminRoutes(fastify){

        fastify.get('/', AdminController.getAll);
        fastify.get('/ativos', AdminController.getAllAtivos);
        fastify.get('/inativos', AdminController.getAllInativos);
        fastify.post('/', AdminController.create);
        fastify.put('/:id', AdminController.update);
        fastify.patch('/:id/inativar', AdminController.inativar);
        fastify.patch('/:id/ativar', AdminController.ativar);

}