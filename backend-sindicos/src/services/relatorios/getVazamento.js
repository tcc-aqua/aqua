import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js";
import Alerta from "../../models/Alertas.js";

export default class GetVazamentos {

  static async getUsersComVazamento(sindicoId) {
    try {
      const condominios = await Condominio.findAll({
        where: { sindico_id: sindicoId },
        attributes: ["id"],
      });

      const condominioIds = condominios.map(c => c.id);
      if (!condominioIds.length) return 0;

      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominioIds },
        attributes: ["id", "responsavel_id"],
      });

      const apartamentoIds = apartamentos.map(a => a.id);

      const alertas = await Alerta.findAll({
        where: {
          tipo: "vazamento", 
          resolvido: false,
          residencia_type: "apartamento",
          residencia_id: apartamentoIds,
        },
        attributes: ["residencia_id"],
      });

      const usuariosComAlerta = alertas
        .map(a => {
          const apt = apartamentos.find(ap => ap.id === a.residencia_id);
          return apt?.responsavel_id;
        })
        .filter(Boolean);

      return [...new Set(usuariosComAlerta)].length;
    } catch (error) {
      console.error("Erro ao buscar usuários com alerta de vazamento:", error);
      throw error;
    }
  }
}
