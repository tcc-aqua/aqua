import Condominio from "../../models/Condominio.js";
import Sensor from "../../models/Sensor.js";
import { Sequelize } from "sequelize";

export default class ConsumoTotalService {

    static async getConsumoTotal(sindico_id) {

        const condominio = await Condominio.findOne({
            where: { sindico_id }
        });

        if (!condominio) {
            throw new Error("Condomínio não encontrado");
        }

        const resultado = await Sensor.findOne({
            where: { condominio_id: condominio.id },
            attributes: [
                [Sequelize.fn("SUM", Sequelize.col("consumo_total")), "total_consumo"]
            ]
        });

        return resultado.dataValues.total_consumo || 0;
    }
}
