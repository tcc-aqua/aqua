import LeituraSensor from '../models/LeituraSensor.js'

export default class LeituraSensorService {

    static async getAll(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['data_registro', 'DESC']]
            }
            const leitura = LeituraSensor.paginate(options);
            return leitura;
        } catch (error){
            console.error('Erro ao listar Leitura de sensores', error);
            throw error;
        }
    }

}