import PasswordController from "../controllers/PasswordController.js";

export default async function passwordRoutes(fastify) {
    // Rota para solicitar o código de redefinição
    // POST /api/password/forgot
    fastify.post('/forgot', {
        schema: {
            summary: 'Pedido de troca de senha',
            tags: ['forgot-password'],
            description: 'Requisição enviada ao servidor para efetuar a troca de senha'
        }
    }, PasswordController.forgotPassword);

    // Rota para efetivar a redefinição com o código
    // POST /api/password/reset
    fastify.post('/reset', {
        schema: {
            summary: 'Resetando e definindo uma nova senha',
            tags: ['forgot-password'],
            description: 'Troca de senha de conta pessoal do usuário'
        }
    }, PasswordController.resetPassword);
}
