import UserView from "../../models/UserView.js";

export default class GetUsersInativos {
  static async getUsersRegistradosInativos(condominio_id) {
    try {
      if (!condominio_id) return 0;

      const users = await UserView.count({
        where: {
          condominio_id,
          user_status: 'inativo' 
        }
      });

      return users;
    } catch (error) {
      console.error("Erro ao contar usuários inativos:", error);
      throw error;
    }
  }
}
