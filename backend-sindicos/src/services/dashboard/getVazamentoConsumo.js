import { Op, fn, col, literal } from "sequelize";
import LeituraSensor from "../../models/LeituraSensor.js";
import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js"; 

export default class GetVazamentoConsumoService {
  static async getRelatorio(sindico_id) {
    try {
      const condominio = await Condominio.findOne({
        where: { sindico_id }
      });

      if (!condominio) {
        console.warn(`Condomínio não encontrado para o síndico ID: ${sindico_id}`);
        return [];
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
        console.warn(`Nenhum sensor encontrado vinculado a apartamentos no Condomínio ID: ${condominioId}`);
        return [];
      }

      const dataInicial = new Date();
      dataInicial.setMonth(dataInicial.getMonth() - 5);
      dataInicial.setDate(1);

      const dados = await LeituraSensor.findAll({
        where: {
          sensor_id: { [Op.in]: sensorIds }, 
          data_registro: { [Op.gte]: dataInicial }
        },
        attributes: [
          [fn("MONTH", col("data_registro")), "mes"],
          [fn("YEAR", col("data_registro")), "ano"],
          [
            literal("SUM(CASE WHEN vazamento_detectado = TRUE THEN 1 ELSE 0 END)"),
            "vazamentos"
          ],
          [
            literal("SUM(CASE WHEN consumo > 10 THEN 1 ELSE 0 END)"),
            "consumo_alto"
          ],
        ],
        group: ["ano", "mes"],
        order: [[literal("ano"), "ASC"], [literal("mes"), "ASC"]]
      });

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
      console.error("Erro ao obter dados de vazamento e consumo:", error);
      throw error;
    }
  }
}