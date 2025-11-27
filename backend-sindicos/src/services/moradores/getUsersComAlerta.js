import Alertas from "../../models/Alertas.js";
import UserView from "../../models/UserView.js";

export default class GetUsersWithAlert {
  static async count(sindico_id) {
    try {
      // Pegar o condomínio do síndico
      const sindico = await UserView.findByPk(sindico_id, {
        attributes: ['condominio_id']
      });

      if (!sindico || !sindico.condominio_id) {
        return 0;
      }

      const condominioId = sindico.condominio_id;

      // Contar alertas ativos (não resolvidos) de consumo alto ou vazamento
      // Para usuários do condomínio
      const count = await Alertas.count({
        distinct: true,
        col: 'residencia_id',
        where: {
          resolvido: false,
          tipo: ['vazamento', 'consumo_alto'],
        },
        include: [
          {
            model: UserView,
            as: 'apartamento', // se necessário, pode usar alias do relacionamento
            where: { condominio_id: condominioId },
            attributes: []
          }
        ]
      });

      return count;
    } catch (error) {
      console.error("Erro ao contar usuários com alertas:", error);
      throw error;
    }
  }
}
