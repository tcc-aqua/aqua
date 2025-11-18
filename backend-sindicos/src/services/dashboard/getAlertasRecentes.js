import Alertas from "../../models/Alertas.js";
import Apartamento from "../../models/Apartamento.js";
import User from "../../models/User.js";

export default class GetAlertasRecentes {
  static async getAlertasRecentes(sindico_id) {
    try {
      const sindico = await User.findByPk(sindico_id);
      
      if (!sindico) {
        console.warn(`Síndico com ID ${sindico_id} não encontrado.`);
        return []; 
      }

      const condominio_id = sindico.condominio_id;
      if (!condominio_id) {
        console.warn(`Síndico ID ${sindico_id} não possui um condominio_id associado. Retornando alertas vazios.`);
        return []; // Retorna array vazio se não houver condomínio
      }
      const alertas = await Alertas.findAll({
        where: { residencia_type: "apartamento" },
        include: [
          {
            model: Apartamento,
            as: "apartamento",
            where: { condominio_id: condominio_id } 
          }
        ],
        order: [["criado_em", "DESC"]],
        limit: 5
      });

      return alertas;
    } catch (error) {
      console.error("Erro ao buscar alertas recentes:", error);
      throw error;
    }
  }
}