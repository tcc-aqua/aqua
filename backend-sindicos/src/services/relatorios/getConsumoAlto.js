import Alertas from "../../models/Alertas.js";
import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";
import { Sequelize } from "sequelize";

export default class ConsumoAlto {
    static async countConsumoAlto(sindico_id) {
        try {
            // 1. Buscar síndico
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) {
                throw new Error("Síndico não encontrado");
            }

            const condominioId = sindico.condominio_id;

            // 2. Contar alertas de consumo alto
            const resultado = await Alertas.count({
                where: {
                    tipo: "consumo_alto",
                    residencia_type: "apartamento",
                    resolvido: false
                },
                include: [
                    {
                        model: Sensor,
                        include: [
                            {
                                model: Apartamento,
                                where: { condominio_id: condominioId }
                            }
                        ]
                    }
                ]
            });

            return resultado;

        } catch (error) {
            console.error("Erro ao contar alertas de consumo alto:", error);
            throw error;
        }
    }
}
