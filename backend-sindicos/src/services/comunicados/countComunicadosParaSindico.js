import Comunicados from "../../models/Comunicados.js";
import { Op } from "sequelize";

export default class CountComunicadosAdminParaSindicoService {
    static async execute() {
        try {
            const count = await Comunicados.count({
                where: {
                    addressee: 'sindicos',
                    condominio_id: {
                        [Op.is]: null
                    },
                    casa_id: {
                        [Op.is]: null
                    }
                }
            });

            return count;
        } catch (error) {
            console.error("Erro ao contar comunicados de Admin para Síndicos:", error);
            throw new Error("Falha ao obter a contagem de comunicados globais para síndicos.");
        }
    }
}