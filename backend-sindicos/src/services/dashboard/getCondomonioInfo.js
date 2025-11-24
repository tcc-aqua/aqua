import Condominio from "../../models/Condominio.js";

export default class GetCondominioInfo {
  static async getCondominio(sindico_id) {
    try {
      const condominio = await Condominio.findOne({
        where: { sindico_id },
        attributes: [
          "name",
          "logradouro",
          "numero",
          "bairro",
          "cidade",
          "uf",
          "estado",
          "cep",
          "codigo_acesso",
          "sindico_id",
        ]
      });

      return condominio ?? null;

    } catch (error) {
      console.error("Erro ao buscar condomínio:", error);
      throw error;
    }
  }
}
