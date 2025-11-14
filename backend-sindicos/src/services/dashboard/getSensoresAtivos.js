import Sensor from "../../models/Sensor.js";
import Apartamento from "../../models/Apartamento.js";
import Condominio from "../../models/Condominio.js";

export default class GetSensoresTotal {

  static async getSensoresAtivos(sindico_id) {
    try {
      const condominio = await Condominio.findOne({ where: { sindico_id } });
      if (!condominio) return 0;

      const apartamentos = await Apartamento.findAll({
        where: { condominio_id: condominio.id },
        attributes: ['sensor_id']
      });

      const sensorIds = apartamentos
        .map(a => a.sensor_id)
        .filter(id => id != null);

      if (sensorIds.length === 0) return 0;

      const count = await Sensor.count({
        where: {
          id: sensorIds,
          status: 'ativo'
        }
      });

      return count;

    } catch (error) {
      console.error("Erro ao contar sensores ativos:", error);
      throw error;
    }
  }
}
