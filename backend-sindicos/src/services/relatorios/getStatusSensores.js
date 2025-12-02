import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js";
import Sensor from "../../models/Sensor.js";

export default class StatusSensores {

  static async getSensoresStatus(sindicoId) {
    try {
      const condominios = await Condominio.findAll({
        where: { sindico_id: sindicoId },
        attributes: ["id"],
      });

      const condominioIds = condominios.map(c => c.id);
      if (!condominioIds.length) return { ativos: 0, inativos: 0 };

      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominioIds },
        attributes: ["sensor_id"],
      });

      const sensorIds = apartamentos.map(a => a.sensor_id).filter(Boolean);
      if (!sensorIds.length) return { ativos: 0, inativos: 0 };

      const sensores = await Sensor.findAll({
        where: { id: sensorIds },
        attributes: ["status"],
      });

      const statusCounts = sensores.reduce(
        (acc, s) => {
          if (s.status === "ativo") acc.ativos += 1;
          else if (s.status === "inativo") acc.inativos += 1;
          return acc;
        },
        { ativos: 0, inativos: 0 }
      );

      return statusCounts;
    } catch (error) {
      console.error("Erro ao buscar status dos sensores:", error);
      throw error;
    }
  }
}
