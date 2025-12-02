import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js";
import LeituraSensor from "../../models/LeituraSensor.js";

export default class UserConsumoMedio {
  
  static async getConsumoMedio(sindicoId) {
    try {
      const condominios = await Condominio.findAll({
        where: { sindico_id: sindicoId },
        attributes: ["id"],
      });
      const condominioIds = condominios.map(c => c.id);
      if (!condominioIds.length) return 0;
      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominioIds },
        attributes: ["id", "sensor_id", "numero_moradores"],
      });

      const sensorIds = apartamentos.map(a => a.sensor_id).filter(Boolean);
      if (!sensorIds.length) return 0;

      const leituras = await LeituraSensor.findAll({
        where: { sensor_id: sensorIds },
        attributes: ["consumo"],
      });

      const totalConsumo = leituras.reduce((sum, l) => sum + parseFloat(l.consumo), 0);

      const totalMoradores = apartamentos.reduce(
        (sum, a) => sum + (a.numero_moradores || 1),
        0
      );

      // Consumo médio por usuário
      const consumoMedio = totalMoradores > 0 ? totalConsumo / totalMoradores : 0;

      return parseFloat(consumoMedio.toFixed(2));
    } catch (error) {
      console.error("Erro ao calcular consumo médio:", error);
      throw error;
    }
  }
}
