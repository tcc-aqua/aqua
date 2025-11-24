import LeituraSensor from "../../models/LeituraSensor.js";
import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";
import { Sequelize } from "sequelize";

export default class ConsumoMedio {
    static async consumoMedio(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);

            if (!sindico) {
                throw new Error("Síndico não encontrado");
            }

            const condominioId = sindico.condominio_id;

            // calcular média apenas do condomínio do síndico
            const resultado = await LeituraSensor.findOne({
                attributes: [
                    [Sequelize.fn("AVG", Sequelize.col("consumo")), "consumo_medio"]
                ],
                include: [
                    {
                        model: Sensor,
                        include: [
                            {
                                model: Apartamento,
                                where: { condominio_id: condominioId },
                                attributes: [] 
                            }
                        ],
                        attributes: []
                    }
                ],
                raw: true
            });

            return resultado?.consumo_medio || 0;

        } catch (error) {
            console.error("Erro ao listar consumo médio do condomínio:", error);
            throw error;
        }
    }
}
