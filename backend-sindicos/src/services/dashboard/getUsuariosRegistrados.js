import User from "../../models/User.js";

export default class GetUsuariosRegistrados {
  static async getUsersRegistrados(sindico_id) {
    try {
      const users = await User.count({
        where: {
          sindico_id
        }
      });

      return users;
    } catch (error) {
      console.error("Erro ao contar usuários:", error);
      throw error;
    }
  }
}
