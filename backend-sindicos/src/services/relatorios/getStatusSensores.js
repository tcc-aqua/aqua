import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";
import { Sequelize } from "sequelize";

export default class StatusSensores {
    static async getStatusCounts(sindico_id) {
        try {
            const sindico = await User.findByPk(sindico_id);
            if (!sindico) {
                throw new Error("Síndico não encontrado");
            }

            const condominioId = sindico.condominio_id;

            const ativos = await Sensor.count({
                where: { status: "ativo" },
                include: [
                    {
                        model: Apartamento,
                        where: { condominio_id: condominioId }
                    }
                ]
            });

            const inativos = await Sensor.count({
                where: { status: "inativo" },
                include: [
                    {
                        model: Apartamento,
                        where: { condominio_id: condominioId }
                    }
                ]
            });

            return {
                ativos,
                inativos
            };

        } catch (error) {
            console.error("Erro ao contar sensores ativos/inativos:", error);
            throw error;
        }
    }
}
