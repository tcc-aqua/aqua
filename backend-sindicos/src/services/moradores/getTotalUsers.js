import UserView from "../../models/UserView.js";

export default class GetUsersTotal {
  static async getUsersRegistrados(condominio_id) {
    try {
      if (!condominio_id) return 0;

      const users = await UserView.count({
        where: {
          condominio_id,
        },
      });

      return users;
    } catch (error) {
      console.error("Erro ao contar usuários:", error);
      throw error;
    }
  }
}
