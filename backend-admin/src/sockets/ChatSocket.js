import chatService from "../services/ChatService.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("Síndico conectado:", socket.id);

    socket.on("join_conversa", ({ conversaId }) => {
      socket.join(conversaId);
      console.log(`${socket.id} entrou na conversa ${conversaId}`);
    });

    socket.on("enviar_mensagem", async ({ conversaId, remetenteId, conteudo }) => {
      const mensagem = await chatService.enviarMensagem(conversaId, remetenteId, "sindico", conteudo);
      io.to(conversaId).emit("nova_mensagem", mensagem);
    });

    socket.on("disconnect", () => {
      console.log("Síndico desconectado:", socket.id);
    });
  });
}
