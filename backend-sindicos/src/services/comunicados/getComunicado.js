import Comunicados from "../../models/Comunicados.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class getComunicadosService {
  static async getAllComunicados(page = 1, limit = 10, sindico_id) {
    try {
      const condominio = await Condominio.findOne({
        where: { sindico_id },
        attributes: ['id']
      });

      const condominio_id = condominio ? condominio.id : null;

      const options = {
        page,
        paginate: limit,
        order: [['criado_em', 'DESC']],
        where: {
          [Op.or]: [
            // comunicados gerais para todos os usuários
            { addressee: 'usuários', condominio_id: null },
            // comunicados gerais para todos os síndicos
            { addressee: 'sindicos', condominio_id: null },
            // comunicados específicos do condomínio
            { condominio_id },
            // comunicados direcionados a esse síndico especificamente
            { sindico_id }
          ]
        }
      };

      return await Comunicados.paginate(options);

    } catch (error) {
      console.error("Erro ao listar comunicados:", error);
      throw error;
    }
  }
}
