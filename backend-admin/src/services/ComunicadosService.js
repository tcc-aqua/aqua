import ComunicadosLidos from "../models/ComunicadoLido.js";
import Comunicados from "../models/Comunicados.js";
import AuditLogService from "./AuditLog.js";

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

   static async update( id, adminId,{ title, subject, addressee, condominio_id }) {
    try {
        const comunicado = await Comunicados.findByPk(id);
        if (!comunicado) throw new Error('Comunicado não encontrado');

        const valorAntigo = {
            title: comunicado.title,
            subject: comunicado.subject,
            addressee: comunicado.addressee,
            condominio_id: comunicado.condominio_id
        };

        await comunicado.update({
            title, subject, addressee, condominio_id
        });

        const valorNovo = {
            title, subject, addressee, condominio_id
        };

        // Criando log de auditoria
        await AuditLogService.criarLog({
            user_id: id,       // registro alterado
            acao: 'update',
            campo: 'comunicado',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

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


    // Marca um comunicado como lido
    static async marcarComoLido(user_id, comunicado_id) {
        try {
            let registro = await ComunicadosLidos.findOne({
                where: { user_id, comunicado_id }
            });

            if (!registro) {
                registro = await ComunicadosLidos.create({
                    user_id,
                    comunicado_id,
                    lido: true
                });
            } else {
                await registro.update({ lido: true });
            }

            return registro;
        } catch (error) {
            console.error("Erro ao marcar comunicado como lido", error);
            throw error;
        }
    }

    // Busca todos os comunicados não lidos de um usuário
    static async getNaoLidos(user_id) {
        try {
            return await ComunicadosLidos.findAll({
                where: { user_id, lido: false },
                include: ["comunicado"] // se quiser incluir dados do comunicado
            });
        } catch (error) {
            console.error("Erro ao buscar comunicados não lidos", error);
            throw error;
        }
    }
}
