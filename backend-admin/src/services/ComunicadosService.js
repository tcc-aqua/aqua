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

    static async update(id, {title, subject, addressee}){
        try {
            const comunicado = await Comunicados.findByPk(id);
            if(!comunicado) throw new Error('Comunicado não encontrado');

            await comunicado.update({
                title, subject, addressee
            })
            return comunicado;

        } catch (error) {
            console.error("Erro ao atualizar comunicado.", error);
            throw error;
        }
    }

    static async deleteComunicado(id) {
        try {
            const comunicado = await Comunicados.findByPk(id);
            if(!comunicado) throw new Error('Comunicado não encontrado');

            await comunicado.destroy();
            return {
                success: true,
                message: 'Comunicado deletado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao deletar comunicado', error);
            throw error;
        }
    }
}