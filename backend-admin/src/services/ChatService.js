import Conversa from "../models/Conversa.js";
import ConversaParticipante from "../models/ConversaParticipante.js";
import Mensagem from "../models/Mensagem.js";

class ChatService {
  async criarConversa(titulo, participantes) {
    const conversa = await Conversa.create({ titulo });
    for (const p of participantes) {
      await ConversaParticipante.create({
        conversa_id: conversa.id,
        usuario_id: p.id,
        usuario_tipo: p.tipo
      });
    }
    return conversa;
  }

  async enviarMensagem(conversaId, remetenteId, remetenteTipo, conteudo) {
    return await Mensagem.create({
      conversa_id: conversaId,
      remetente_id: remetenteId,
      remetente_tipo: remetenteTipo,
      conteudo
    });
  }

  async listarMensagens(conversaId) {
    return await Mensagem.findAll({
      where: { conversa_id: conversaId },
      order: [["criado_em", "ASC"]]
    });
  }
}

export default new ChatService();
