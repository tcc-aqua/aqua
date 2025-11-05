import Suporte from "../models/Suporte.js";

export default class SuporteService {
    static async getAllMensagens(page = 1, limit = 10){
        try {
            const options = {
                page,
                paginate: limit
            }
            const mensagens = await Suporte.paginate(options);
            return mensagens;
        } catch (error){
            console.error('Erro ao listar as mensagens', error);
            throw error;
        }
    }
}