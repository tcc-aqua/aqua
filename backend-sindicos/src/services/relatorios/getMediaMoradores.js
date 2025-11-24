import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";
import { Sequelize } from "sequelize";

export default class MediaMoradores {
    static async getMediaMoradores(sindico_id) {
        try {
            // 1. Buscar síndico
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) throw new Error("Síndico não encontrado");

            const condominioId = sindico.condominio_id;

            // 2. Calcular média de moradores por apartamento
            const resultado = await Apartamento.findOne({
                attributes: [
                    [Sequelize.fn("AVG", Sequelize.col("numero_moradores")), "media_moradores"]
                ],
                where: {
                    condominio_id: condominioId,
                    status: "ativo"
                },
                raw: true
            });

            return Number(resultado?.media_moradores || 0);

        } catch (error) {
            console.error("Erro ao calcular média de moradores:", error);
            throw error;
        }
    }
}
