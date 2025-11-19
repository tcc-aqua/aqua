import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"]
});

const conversaId = 1;
const remetenteId = "d6af71ae-b437-419c-927a-26a5da175bf6";

socket.on("connect", () => {
  console.log("Conectado:", socket.id);

  socket.emit("join_conversa", { conversaId });

  setTimeout(() => {
    socket.emit("enviar_mensagem", {
      conversaId,
      remetenteId,
      conteudo: "Olá, teste do chat via WebSocket!"
    });
  }, 1000);
});

socket.on("nova_mensagem", (mensagem) => {
  console.log("Mensagem recebida:", mensagem);
});

socket.on("connect_error", (err) => {
  console.error("Erro de conexão:", err);
});
