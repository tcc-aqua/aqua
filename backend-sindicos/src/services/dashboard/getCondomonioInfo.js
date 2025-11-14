import Condominio from "../../models/Condominio.js";

export default class GetCondominioInfo {
  static async getCondominio(sindico_id) {
    try {
      const condominio = await Condominio.findOne({
        where: { sindico_id }
      });

      if (!condominio) {
        return null; 
      }

      return condominio;
    } catch (error) {
      console.error("Erro ao buscar condomínio:", error);
      throw error;
    }
  }
}
