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

    static async create({ title, subject, addressee, condominio_id = null, casa_ids = [], sindico_ids = [] }) {
        try {
            const comunicados = [];

            // Comuniado geral para todos de um tipo
            if (!condominio_id && casa_ids.length === 0 && sindico_ids.length === 0) {
                const comunicado = await Comunicados.create({
                    title,
                    subject,
                    addressee,
                    condominio_id: null
                });
                comunicados.push(comunicado);
            }

            // Comuniado para um condomínio específico
            if (condominio_id) {
                const comunicado = await Comunicados.create({
                    title,
                    subject,
                    addressee,
                    condominio_id
                });
                comunicados.push(comunicado);
            }

            // Comuniados para casas específicas
            if (casa_ids.length > 0) {
                for (const casaId of casa_ids) {
                    const comunicado = await Comunicados.create({
                        title,
                        subject,
                        addressee: 'usuários',
                        condominio_id: casaId
                    });
                    comunicados.push(comunicado);
                }
            }

            // Comuniados para síndicos específicos
            if (sindico_ids.length > 0) {
                for (const sindicoId of sindico_ids) {
                    const comunicado = await Comunicados.create({
                        title,
                        subject,
                        addressee: 'sindicos',
                        condominio_id: sindicoId
                    });
                    comunicados.push(comunicado);
                }
            }

            return comunicados;

        } catch (error) {
            console.error('Erro ao criar comunicado.', error);
            throw error;
        }
    }

    static async update(id, { title, subject, addressee, condominio_id }) {
        try {
            const comunicado = await Comunicados.findByPk(id);
            if (!comunicado) throw new Error('Comunicado não encontrado');

            await comunicado.update({
                title, subject, addressee, condominio_id
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
            if (!comunicado) throw new Error('Comunicado não encontrado');

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