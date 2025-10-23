import { Login } from "../controllers/AuthController.js";

export default async function authRoutes(fastify){
    fastify.post('/login', Login);
}