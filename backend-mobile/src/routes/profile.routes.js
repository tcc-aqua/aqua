// AQUI: Adicionamos .js nos dois imports
import ProfileController from '../controllers/ProfileController.js';
import { authMiddleware } from '../middlewares/AuthMidlleweare.js';

async function profileRoutes(fastify, options) {
  fastify.get(
    '/',
    {
      preHandler: [authMiddleware],
    },
    ProfileController.getAuthenticatedUserProfile
  );
}

export default profileRoutes;