import User from "../../models/User.js";

export default class GetUsersInativos {
  static async getUsersRegistradosInativos(sindico_id) {
    try {
      const users = await User.count({
        where: {
          sindico_id,
          status: 'inativo'
        }
      });

      return users;
    } catch (error) {
      console.error("Erro ao contar usuários:", error);
      throw error;
    }
  }
}
