import Comunicados from "../models/Comunicados.js";

export default class ComunicadosService {

    static async getAll() {
        try {
            const comunicados = await Comunicados.findAll();
            return comunicados;
        } catch (error) {
            console.error('Erro ao listar comunicados', error);
            throw error;
        }
    }

    static async create({ title, subject, addressee }) {
        try {
            const comunicado = await Comunicados.create({
                title, subject, addressee
            });
            return comunicado;
        } catch (error) {
            console.error('Erro ao criar comunicado.', error);
            throw error;
        }
    }
}