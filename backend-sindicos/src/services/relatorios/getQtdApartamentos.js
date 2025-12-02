import CondominioView from "../../models/CondominioView.js";

export default class QtdApartamentos {
  static async getNumeroApartamentos(sindico_id) {
    try {
      if (!sindico_id) return 0;

      // Buscar o condomínio onde o usuário é síndico
      const condominio = await CondominioView.findOne({
        where: { sindico_id }, // coluna correta na view
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
