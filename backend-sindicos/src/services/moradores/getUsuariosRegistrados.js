import UserView from "../../models/UserView.js";

export default class GetUsuariosRegistradosAtivos {
  static async getUsersAtivosRegistrados(condominio_id) {
    try {
      if (!condominio_id) return 0;

      const count = await UserView.count({
        where: {
          condominio_id: condominio_id,
          user_status: 'ativo'
        }
      });

      return count;
    } catch (error) {
      console.error("Erro ao contar usuários ativos:", error);
      return 0;
    }
  }
}
