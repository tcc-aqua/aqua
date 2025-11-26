import Suporte from "../models/Suporte.js";
import  SuporteLidos  from "../models/Suporte.js"; // ou "./SuporteLidos.js"
import User from "../models/User.js";

export default class SuporteService {
    // Listar mensagens com paginação
    static async getAllMensagens(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const mensagens = await Suporte.findAndCountAll({
                order: [["criado_em", "DESC"]],
                offset,
                limit
            });

            return {
                total: mensagens.count,
                page,
                limit,
                mensagens: mensagens.rows
            };
        } catch (error) {
            console.error("Erro ao listar as mensagens", error);
            throw error;
        }
    }

    static async responderMensagem(id, resposta) {
        try {
            const mensagem = await Suporte.findByPk(id);
            if (!mensagem) {
                throw new Error("Mensagem não encontrada.");
            }

            mensagem.resposta = resposta;
            mensagem.status = "respondido";
            await mensagem.save();

            return mensagem;
        } catch (error) {
            console.error("Erro ao responder a mensagem", error);
            throw error;
        }
    }

    static async deletarMensagem(id, user_id, isAdmin = false) {
        try {
            const mensagem = await Suporte.findByPk(id);
            if (!mensagem) throw new Error("Mensagem não encontrada.");

            if (!isAdmin && mensagem.remetente_id !== user_id) {
                throw new Error("Usuário não autorizado a deletar esta mensagem.");
            }

            await mensagem.destroy();
            return { success: true };
        } catch (error) {
            console.error("Erro ao deletar mensagem", error);
            throw error;
        }
    }

    static async marcarComoVisualizada(suporte_id, user_id) {
        try {
            const [registro, created] = await SuporteLidos.findOrCreate({
                where: { suporte_id, user_id },
                defaults: { lido: true }
            });

            if (!created && !registro.lido) {
                registro.lido = true;
                registro.marcado_em = new Date();
                await registro.save();
            }

            return registro;
        } catch (error) {
            console.error("Erro ao marcar mensagem como visualizada", error);
            throw error;
        }
    }
}
