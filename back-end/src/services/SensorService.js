import Sensor from "../models/Sensor.js";

export default class SensorService {

    static async getAll(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']]
            }
            const sensores = await Sensor.paginate(options);
            return sensores;
        } catch (error) {
            console.error('Erro ao listar sensores', error);
            throw error;
        }
    }


}