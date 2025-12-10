import { Op } from "sequelize";
import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";
import Condominio from "../../models/Condominio.js";

export default class UserStatusService {
  static async getUsuariosStatusPorSemana(sindicoId, inicioSemana) {
    try {
      const condominios = await Condominio.findAll({
        where: { sindico_id: sindicoId },
        attributes: ["id"],
      });

      const condominioIds = condominios.map(c => c.id);
      if (!condominioIds.length) return {};

      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominioIds },
        attributes: ["id"],
      });

      const apartamentoIds = apartamentos.map(a => a.id);
      if (!apartamentoIds.length) return {};

      const resultado = {};
      const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(inicioSemana.getDate() + i);

        const proximoDia = new Date(dia);
        proximoDia.setDate(dia.getDate() + 1);

        // Contar usuários que tiveram status alterado nesse dia
        const ativosAlterados = await User.count({
          where: {
            residencia_id: apartamentoIds,
            residencia_type: "apartamento",
            status: "ativo",
            atualizado_em: {
              [Op.between]: [dia, proximoDia],
            },
          },
        });

        const inativosAlterados = await User.count({
          where: {
            residencia_id: apartamentoIds,
            residencia_type: "apartamento",
            status: "inativo",
            atualizado_em: {
              [Op.between]: [dia, proximoDia],
            },
          },
        });

        resultado[diasDaSemana[i]] = {
          ativosAlterados,
          inativosAlterados,
        };
      }

      return resultado;
    } catch (error) {
      console.error("Erro ao buscar status de usuários por semana:", error);
      throw error;
    }
  }
}
