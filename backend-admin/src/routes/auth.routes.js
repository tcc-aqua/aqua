import { Login, getMe } from "../controllers/AuthController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function authRoutes(fastify){
    fastify.post('/login', Login);
    fastify.get('/me', { preHandler: autenticarAdmin }, getMe);
}