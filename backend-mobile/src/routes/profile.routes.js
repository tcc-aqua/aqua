import ProfileController from '../controllers/ProfileController.js';
import { authMiddleware } from '../middlewares/AuthMidlleweare.js';

async function profileRoutes(fastify, options) {
  fastify.get(
    '/', {
      schema: {
        summary: 'Rota para puxar as informações pessoal do usuário',
        tags: ['profile'],
        description: 'Listando informações do usuário'
      }
    },
    {
      preHandler: [authMiddleware],
    },
    ProfileController.getAuthenticatedUserProfile
  );
}

export default profileRoutes;