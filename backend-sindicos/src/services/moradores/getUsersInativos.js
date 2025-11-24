import UserView from "../../models/UserView.js";

export default class GetUsersInativos {
  static async getUsersRegistradosInativos(sindico_id) {
    try {
      const sindico = await UserView.findByPk(sindico_id, {
        attributes: ['condominio_id']
      });

      if (!sindico || !sindico.condominio_id) {
        return 0; 
      }

      const condominioId = sindico.condominio_id;

      const users = await UserView.count({
        where: {
          condominio_id: condominioId,
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
