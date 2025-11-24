import Alertas from "../../models/Alertas.js";
import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";

export default class AlertasVazamentos {
    static async countVazamentos(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) {
                throw new Error("Síndico não encontrado");
            }

            const condominioId = sindico.condominio_id;

            const total = await Alertas.count({
                where: {
                    tipo: "vazamento",
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

            return total;

        } catch (error) {
            console.error("Erro ao contar alertas de vazamento:", error);
            throw error;
        }
    }
}
