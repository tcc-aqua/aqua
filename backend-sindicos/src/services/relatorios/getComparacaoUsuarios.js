import { Op, fn, col } from "sequelize";
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
        attributes: ["responsavel_id"],
      });

      const usuarioIds = apartamentos.map(a => a.responsavel_id).filter(Boolean);
      if (!usuarioIds.length) return {};

      const resultado = {};
      const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana);
        dia.setDate(inicioSemana.getDate() + i);

        const proximoDia = new Date(dia);
        proximoDia.setDate(dia.getDate() + 1);

        const ativos = await User.count({
          where: {
            id: usuarioIds,
            status: "ativo",
            criado_em: { [Op.lte]: proximoDia },
          },
        });

        const inativos = await User.count({
          where: {
            id: usuarioIds,
            status: "inativo",
            criado_em: { [Op.lte]: proximoDia },
          },
        });

        resultado[diasDaSemana[i]] = { ativos, inativos };
      }

      return resultado;
    } catch (error) {
      console.error("Erro ao buscar status de usuários por semana:", error);
      throw error;
    }
  }
}
