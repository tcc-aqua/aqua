import { Op, fn, col, literal } from "sequelize";
import LeituraSensor from "../../models/LeituraSensor.js";
import Sensor from "../../models/Sensor.js";
import Condominio from "../../models/Condominio.js";

export default class GetVazamentoConsumoService {
  static async getRelatorio(sindico_id) {
    try {
      // 1. buscar o condomínio do síndico
      const condominio = await Condominio.findOne({
        where: { sindico_id }
      });

      if (!condominio) return [];

      // 2. buscar sensores do condomínio
      const sensores = await Sensor.findAll({
        where: { condominio_id: condominio.id },
        attributes: ["id"]
      });

      const sensorIds = sensores.map(s => s.id);
      if (sensorIds.length === 0) return [];

      // 3. pegar últimos 6 meses
      const dataInicial = new Date();
      dataInicial.setMonth(dataInicial.getMonth() - 5);
      dataInicial.setDate(1);

      // 4. query agregada
      const dados = await LeituraSensor.findAll({
        where: {
          sensor_id: sensorIds,
          data_registro: { [Op.gte]: dataInicial }
        },
        attributes: [
          [fn("MONTH", col("data_registro")), "mes"],
          [fn("YEAR", col("data_registro")), "ano"],
          [
            fn("SUM", literal("CASE WHEN vazamento_detectado = true THEN 1 ELSE 0 END")),
            "vazamentos"
          ],
          [
            fn("SUM", literal("CASE WHEN consumo > 10 THEN 1 ELSE 0 END")),
            "consumo_alto"
          ],
        ],
        group: ["ano", "mes"],
        order: [[literal("ano"), "ASC"], [literal("mes"), "ASC"]]
      });

      // 5. converter meses para formato do gráfico
      const nomeMes = [
        "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      return dados.map(item => ({
        month: nomeMes[item.dataValues.mes],
        vazamentos: Number(item.dataValues.vazamentos),
        consumo_alto: Number(item.dataValues.consumo_alto)
      }));

    } catch (error) {
      console.error("Erro ao obter dados:", error);
      throw error;
    }
  }
}
