import Apartamento from "../../models/Apartamento.js";
import Condominio from "../../models/Condominio.js";

export default class QtdApartamentosService {
  static async qtdApartamentos(sindico_id) {
    try {
      const condominio = await Condominio.findOne({ where: { sindico_id } });
      if (!condominio) return 0;

      const totalAtivos = await Apartamento.count({
        where: {
          condominio_id: condominio.id, 
        }
      });

      return totalAtivos;

    } catch (error) {
      console.error("Erro ao contar apartamentos:", error);
      throw error;
    }
  }
}
