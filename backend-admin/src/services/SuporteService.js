import Suporte from "../models/Suporte.js";

export default class SuporteService {
    static async getAllMensagens(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit
            }
            const mensagens = await Suporte.paginate(options);
            return mensagens;
        } catch (error) {
            console.error('Erro ao listar as mensagens', error);
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
}