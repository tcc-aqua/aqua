import chatService from "../services/ChatService.js";

class ChatController {
  async criarConversa(req, reply) {
    const { titulo, participantes } = req.body;
    const conversa = await chatService.criarConversa(titulo, participantes);
    return reply.send(conversa);
  }

  async listarMensagens(req, reply) {
    const { conversaId } = req.params;
    const mensagens = await chatService.listarMensagens(conversaId);
    return reply.send(mensagens);
  }
}

export default new ChatController();
