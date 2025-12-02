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
            { sindico_id },
            
            { 
              addressee: 'sindicos', 
              [Op.or]: [
                { condominio_id: null },
                { condominio_id }        
              ]
            },
            
            {
              addressee: { [Op.notIn]: ['usuários', 'administradores'] }, 
              condominio_id,
            }
          ]
        }
      };
      
      if (!condominio_id) {
          options.where[Op.or] = [
              { sindico_id },
              { addressee: 'sindicos', condominio_id: null }
          ];
      }

      return await Comunicados.paginate(options);

    } catch (error) {
      console.error("Erro ao listar comunicados:", error);
      throw error;
    }
  }
}