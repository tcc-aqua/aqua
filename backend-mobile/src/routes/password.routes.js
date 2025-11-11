import PasswordController from "../controllers/PasswordController.js";

export default async function passwordRoutes(fastify) {

    fastify.post('/', {
        schema: {
            summary: 'Pedido de troca de senha',
            tags: ['forgot-password'],
            description: 'Requisição enviada ao servidor para efetuar a troca de senha'
        }
    }, PasswordController.forgotPassword);

    fastify.post('/reset', {
        schema: {
            summary: 'Resetando e definindo uma nova senha',
            tags: ['forgot-passowrd'],
            description: 'Troca de senha de conta pessoal do uusário'
        }
    }, PasswordController.resetPassword);
}