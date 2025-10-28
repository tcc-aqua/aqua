import PasswordController from "../controllers/PasswordController.js";

export default async function passwordRoutes(fastify){

    fastify.post('/', PasswordController.forgotPassword);
    fastify.post('/reset', PasswordController.resetPassword);

}