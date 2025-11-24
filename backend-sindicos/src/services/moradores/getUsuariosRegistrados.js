import UserView from "../../models/UserView.js";

export default class GetUsuariosRegistradosAtivos {
  static async getUsersAtivosRegistrados(sindico_id) {
    try {
      // Pega o condominio do síndico
      const sindico = await UserView.findByPk(sindico_id, {
        attributes: ['condominio_id']
      });

      if (!sindico || !sindico.condominio_id) {
        return 0;
      }

      const condominioId = sindico.condominio_id;

      // Conta usuários ativos do condomínio
      const users = await UserView.count({
        where: {
          condominio_id: condominioId,
          status: 'ativo'
        }
      });

      return users;
    } catch (error) {
      console.error("Erro ao contar usuários:", error);
      throw error;
    }
  }
}
