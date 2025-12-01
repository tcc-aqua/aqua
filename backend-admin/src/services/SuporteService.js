import Suporte from "../models/Suporte.js";

export default class SuporteService {

    static async criarMensagem({ assunto, mensagem, remetente, tipo_destino, destinatario_id = null, condominio_id }) {
        try {
            const novaMensagem = await Suporte.create({
                assunto,
                mensagem,
                remetente_id: remetente.id,  
                destinatario_id,            
                tipo_destino,                
                condominio_id
            });

            return novaMensagem;
        } catch (error) {
            console.error("Erro ao criar a mensagem:", error);
            throw new Error("Erro ao criar a mensagem.");
        }
    }

    static async getAllMensagens(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const mensagens = await Suporte.findAndCountAll({
                order: [["criado_em", "DESC"]],
                limit,
                offset
            });

            return {
                total: mensagens.count,
                page,
                limit,
                mensagens: mensagens.rows
            };
        } catch (error) {
            console.error("Erro ao listar as mensagens:", error);
            throw new Error("Erro ao listar mensagens.");
        }
    }

    static async responderMensagem(id, resposta, respondente) {
        try {
            const mensagem = await Suporte.findByPk(id);
            if (!mensagem) throw new Error("Mensagem não encontrada.");

            mensagem.resposta = resposta;
            mensagem.status = "respondido";
            mensagem.respondido_por_email = respondente.email;
            mensagem.respondido_por_tipo = respondente.role; 

            await mensagem.save();

            return mensagem;
        } catch (error) {
            console.error("Erro ao responder a mensagem:", error);
            throw new Error("Erro ao responder a mensagem.");
        }
    }

    static async deletarMensagem(id, user_id, isAdmin = false) {
        try {
            const mensagem = await Suporte.findByPk(id);
            if (!mensagem) throw new Error("Mensagem não encontrada.");

            if (!isAdmin && mensagem.remetente_id !== user_id) {
                throw new Error("Você não tem permissão para deletar esta mensagem.");
            }

            await mensagem.destroy();

            return { success: true };
        } catch (error) {
            console.error("Erro ao deletar mensagem:", error);
            throw new Error("Erro ao deletar mensagem.");
        }
    }
}
