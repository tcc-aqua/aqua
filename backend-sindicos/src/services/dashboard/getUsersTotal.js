import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";

export default class GetUsersTotal {
  static async getCountUsers(condominio_id) {
    try {
      const count = await User.count({
        where: { status: 'ativo' },
        include: [
          {
            model: Apartamento,
            as: 'apartamento', 
            where: { condominio_id }
          }
        ]
      });

      return count;
    } catch (error) {
      console.error("Erro ao contar usuários:", error);
      throw error;
    }
  }
}
