import Condominio from "../../models/Condominio.js";
import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js"; 
import { Sequelize, Op } from "sequelize"; 

export default class ConsumoTotalService {

    static async getConsumoTotal(sindico_id) {
        try {
            const condominio = await Condominio.findOne({
                where: { sindico_id }
            });

            if (!condominio) {
                console.warn(`Condomínio não encontrado para o síndico ID: ${sindico_id}`);
                return 0;
            }

            const condominioId = condominio.id;

            const apartamentos = await Apartamento.findAll({
                where: { condominio_id: condominioId },
                attributes: ["sensor_id"]
            });

            const sensorIds = apartamentos
                                .map(ap => ap.sensor_id)
                                .filter(id => id); 

            if (sensorIds.length === 0) {
                return 0; 
            }

            const resultado = await Sensor.findOne({
                where: {
                    id: { [Op.in]: sensorIds } 
                },
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("consumo_total")), "total_consumo"]
                ]
            });

            return parseFloat(resultado.dataValues.total_consumo) || 0;

        } catch (error) {
            console.error("Erro ao calcular Consumo Total:", error);
            throw error;
        }
    }
}