import UpdateController from "../controllers/UserController.js";

export default async function userRoutes(fastify){
    fastify.put('/me', UpdateController.updateMe);
}