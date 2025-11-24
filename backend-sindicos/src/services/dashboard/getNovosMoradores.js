import { Op, fn, col, literal } from "sequelize";
import User from "../../models/User.js";
import Apartamento from "../../models/Apartamento.js";
import Condominio from "../../models/Condominio.js";

export default class GetNovosMoradoresService {
  static async getNovosMoradores(sindico_id) {
    try {
      // 1. buscar o condomínio do síndico
      const condominio = await Condominio.findOne({
        where: { sindico_id },
        attributes: ["id"]
      });

      if (!condominio) return [];

      // 2. buscar todos os apartamentos do condomínio
      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominio.id },
        attributes: ["id"]
      });

      const apartamentoIds = apartamentos.map(a => a.id);
      if (apartamentoIds.length === 0) return [];

      // 3. ultimos 6 meses
      const dataInicial = new Date();
      dataInicial.setMonth(dataInicial.getMonth() - 5);
      dataInicial.setDate(1);

      // 4. agregação
      const dados = await User.findAll({
        where: {
          residencia_type: "apartamento",
          residencia_id: apartamentoIds,
          role: "morador",
        },
        attributes: [
          [fn("MONTH", col("criado_em")), "mes"],
          [fn("YEAR", col("criado_em")), "ano"],
          [fn("COUNT", col("id")), "novos"]
        ],
        group: ["ano", "mes"],
        order: [["ano", "ASC"], ["mes", "ASC"]]
      });

      // 5. converter mês em texto
      const nomeMes = [
        "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      return dados.map(item => ({
        month: nomeMes[item.dataValues.mes],
        novos: Number(item.dataValues.novos)
      }));

    } catch (error) {
      console.error("Erro ao contar novos moradores:", error);
      throw error;
    }
  }
}
