import PasswordController from "../controllers/PasswordController.js";

export default async function passwordRoutes(fastify) {
    // Rota para solicitar o código de redefinição
    // POST /api/password/forgot
    fastify.post('/forgot', PasswordController.forgotPassword);

    // Rota para efetivar a redefinição com o código
    // POST /api/password/reset
    fastify.post('/reset', PasswordController.resetPassword);
}