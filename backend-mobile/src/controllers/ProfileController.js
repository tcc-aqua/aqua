import ProfileService from '../services/ProfileService.js';

class ProfileController {
  async getAuthenticatedUserProfile(request, reply) {
    try {
      const userId = request.user.id;

      if (!userId) {
        return reply.status(401).send({ message: 'Acesso não autorizado.' });
      }

      const userProfile = await ProfileService.findProfileById(userId);

      if (!userProfile) {
        return reply.status(404).send({ message: 'Perfil de usuário não encontrado.' });
      }

      return reply.status(200).send(userProfile);
    } catch (error) {
        reply.status(500).send({ message: error.message });
    }
  }
}

export default new ProfileController();