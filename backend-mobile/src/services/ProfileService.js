// AQUI: Adicionamos .js ao final de sequelize
import sequelize from '../config/sequelize.js';

class ProfileService {
  async findProfileById(id) {
    try {
      const [profile] = await sequelize.query(
        'SELECT * FROM vw_users WHERE user_id = :id LIMIT 1',
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return profile;
    } catch (error) {
      console.error('Erro no ProfileService:', error);
      throw new Error('Erro ao buscar dados do perfil.');
    }
  }
}

export default new ProfileService();