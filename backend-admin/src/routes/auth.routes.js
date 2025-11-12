import { Login, Logout, getMe, verifyToken } from "../controllers/AuthController.js";
import { autenticarAdmin } from "../middlewares/AuthMiddleware.js";

export default async function authRoutes(fastify) {
    fastify.post('/login',
        {
            schema: {
                summary: 'Autenticação para entrar no sistema',
                tags: ['autenticação'],
                description: 'Rota para adentrar ao sistema'
            }
        }, Login);
    fastify.get('/me',
        {
            schema: {
                summary: 'Get de informações do user logado',
                tags: ['autenticação'],
                description: 'Puxar informações do usuário logado'
            },
            preHandler: autenticarAdmin
        },
        getMe);
        
    fastify.post('/logout', {
        schema: {
            summary: 'Logout de conta administrador',
            tags: ['autenticação'],
            description: 'Rota para efetuar o logout do administrador'
        },
        preHandler: verifyToken
    }, Logout);
}
