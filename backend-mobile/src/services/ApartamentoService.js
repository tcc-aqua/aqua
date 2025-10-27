import Apartamento from "../models/Apartamento.js";
import Sensor from "../models/Sensor.js";

export default class ApartamentoService {


    static async getConsumoTotal(apartamentoId) {
        try {

            const apartamento = await Apartamento.findOne({
                where: { id: apartamentoId },
                include: {
                    model: Sensor,
                    as: 'sensor',
                    attributes: ['consumo_total'] // só pega o consumo
                }
            });

            if (!apartamento) throw new Error('Apartamento não encontrado');

            return apartamento.sensor.consumo_total;
        } catch (error) {
            console.error('Erro ao listar consumo total do seu apartamento', error);
            throw error;
        }
    }

}