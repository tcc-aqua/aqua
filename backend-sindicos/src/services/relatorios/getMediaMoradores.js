import { fn, col } from "sequelize";
import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js";

export default class MediaMoradores {
  static async getMediaMoradoresPorApartamento(sindicoId) {
    try {
      const condominios = await Condominio.findAll({
        where: { sindico_id: sindicoId },
        attributes: ["id"],
      });

      const condominioIds = condominios.map(c => c.id);
      if (!condominioIds.length) return 0;

      const media = await Apartamento.findAll({
        where: { condominio_id: condominioIds },
        attributes: [[fn("AVG", col("numero_moradores")), "media_moradores"]],
        raw: true,
      });

      return parseFloat(media[0].media_moradores) || 0;
    } catch (error) {
      console.error("Erro ao calcular média de moradores:", error);
      throw error;
    }
  }
}
