import UserController from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js"

export default async function authRoutes(fastify) {
  fastify.post("/register", UserController.register);
  fastify.post("/login", UserController.login);
  fastify.get("/me", { preHandler: authMiddleware }, UserController.me);
}
