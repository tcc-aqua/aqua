import Comunicados from "../../models/Comunicados.js";
import Condominio from "../../models/Condominio.js";
import { Op } from "sequelize";

export default class getTotalComunicados {

    static async countTotalComunicados(sindico_id) {
        try {
            // 1. Encontrar o Condomínio (necessário para aplicar o filtro por Condomínio)
            const condominio = await Condominio.findOne({
                where: { sindico_id },
                attributes: ['id']
            });

            const condominio_id = condominio ? condominio.id : null;

            // 2. Definir as condições de busca (WHERE clause)
            const whereClause = {
                [Op.or]: [
                    // comunicados gerais para todos os usuários (gerais)
                    { addressee: 'usuários', condominio_id: null }, 
                    // comunicados gerais para todos os síndicos (gerais)
                    { addressee: 'sindicos', condominio_id: null },
                    // comunicados específicos do condomínio (por condominio_id)
                    { condominio_id }, 
                    // comunicados direcionados a esse síndico especificamente (por sindico_id)
                    { sindico_id }
                ]
            };

            // 3. Usar o método count() do Sequelize para obter apenas o número total
            const total = await Comunicados.count({
                where: whereClause
            });

            return total;

        } catch (error) {
            console.error("Erro ao contar comunicados:", error);
            throw error;
        }
    }
}