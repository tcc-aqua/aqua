import DashboardController from "../controllers/DashboardController.js";
import { autenticarSindico } from "../middlewares/AuthMiddleware.js";

export default async function dashboardRoutes(fastify) {
    fastify.get('/', {
        schema: {
            summary: 'Listando as informações da tela principal',
            tags: ['dashboard'],
            description: 'Get das infos'
        },
        preHandler: [autenticarSindico]
    }, DashboardController.info);
}