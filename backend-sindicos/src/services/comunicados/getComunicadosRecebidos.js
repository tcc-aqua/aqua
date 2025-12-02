import Comunicados from "../../models/Comunicados.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class CountComunicadosRecebidosService {
    static async countRecebidos(sindico_id) {
        try {
            if (!sindico_id) {
                return 0;
            }

            const condominio = await Condominio.findOne({
                where: { sindico_id },
                attributes: ['id']
            });

            const condominio_id = condominio ? condominio.id : null;
            const whereCondition = {
                [Op.or]: [
                    { sindico_id: sindico_id },
                    { addressee: 'sindicos', condominio_id: null },
                    { 
                        condominio_id: condominio_id,
                        addressee: { [Op.notIn]: ['usuários', 'administradores'] }
                    }
                ]
            };

            if (!condominio_id) {
                whereCondition[Op.or] = [
                    { sindico_id: sindico_id },
                    { addressee: 'sindicos', condominio_id: null }
                ];
            }


            const totalRecebidos = await Comunicados.count({
                where: whereCondition
            });

            return totalRecebidos;

        } catch (error) {
            console.error("Erro ao contar comunicados recebidos pelo síndico:", error);
            throw error;
        }
    }
}