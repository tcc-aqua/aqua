import Comunicados from "../models/Comunicados.js";

export default class ComunicadosService {
    static async getAll(req, reply){
        try {
            const comunicados = await Comunicados.findAll({
                where: {addressee: 'usuários'}
            });
            return comunicados;
        } catch (error) {
            console.error('Erro ao listar comunicados', error);
            throw error;
        }
    }
}