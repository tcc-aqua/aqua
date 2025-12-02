import Alertas from "../../models/Alertas.js";
import UserView from "../../models/UserView.js";
import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";

export default class GetUsersWithAlert {
  static async count(sindico_id) {
    try {
      // Busca o condomínio do síndico
      const sindico = await User.findByPk(sindico_id, {
        include: [
          {
            model: Apartamento,
            as: 'apartamento',
            attributes: ['condominio_id']
          }
        ]
      });

      if (!sindico || !sindico.apartamento?.condominio_id) {
        return 0;
      }

      const condominioId = sindico.apartamento.condominio_id;

      // Contar alertas ativos (não resolvidos) de consumo alto ou vazamento
      // Para usuários do condomínio
      const count = await Alertas.count({
        distinct: true,
        col: 'residencia_id',
        where: {
          resolvido: false,
          tipo: ['vazamento', 'consumo_alto']
        },
        include: [
          {
            model: UserView,
            as: 'apartamento', // relacionamento definido no model Alertas
            where: { condominio_id: condominioId },
            attributes: []
          }
        ]
      });

      return count;
    } catch (error) {
      console.error("Erro ao contar usuários com alertas:", error);
      return 0;
    }
  }
}
