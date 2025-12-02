import CondominioView from "../../models/CondominioView.js";

export default class QtdApartamentos {
  static async getNumeroApartamentos(sindicoId) {
    try {
      const condominio = await CondominioView.findOne({
        where: { sindico_id: sindicoId },
        attributes: ["numero_apartamentos"],
      });

      if (!condominio) return 0;

      return condominio.numero_apartamentos || 0;
    } catch (error) {
      console.error("Erro ao buscar número de apartamentos:", error);
      throw error;
    }
  }
}
