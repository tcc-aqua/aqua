import Apartamento from "../../models/Apartamento.js";
import Condominio from "../../models/Condominio.js";

export default class GetApartamentosAtivo {
  static async getApartamentos(sindico_id) {
    try {
      // Primeiro pega o condomínio do síndico
      const condominio = await Condominio.findOne({ where: { sindico_id } });
      if (!condominio) return 0;

      // Depois conta os apartamentos ativos desse condomínio
      const totalAtivos = await Apartamento.count({
        where: {
          condominio_id: condominio.id, // <--- correto
          status: "ativo"
        }
      });

      return totalAtivos;

    } catch (error) {
      console.error("Erro ao contar apartamentos:", error);
      throw error;
    }
  }
}
