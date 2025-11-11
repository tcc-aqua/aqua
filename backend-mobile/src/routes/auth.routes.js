import UserController from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMidlleweare.js"

export default async function authRoutes(fastify) {
  fastify.post("/register", 
    {
      schema: {
        summary: 'Cadastrando um novo usuário',
        tags: ['autenticação'],
        description: 'Registrando um novo usuário no sistema mobile'
      }
    },
    UserController.register);

  fastify.post("/login",
    {
      schema: {
        summary: 'Login do usuário',
        tags: ['autenticação'],
        description: 'Rota para o usuário poder fazer o login e entrar no seu app'
      }
    },
    UserController.login);

  fastify.get('/me', 
    {
      schema: {
        summary: "Informações do usuário",
        tags: ['autenticação'],
        description: 'Rota para a API puxar as informações do usuário logado'
      }
    },
    { preHandler: authMiddleware }, UserController.me);
}
