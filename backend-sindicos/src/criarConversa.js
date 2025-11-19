import dotenv from "dotenv";
dotenv.config({ path: resolve("..", ".env") }); 
import { resolve } from "path";
import chatService from "./services/chat/ChatService.js"

const run = async () => {
  const novaConversa = await chatService.criarConversa("Conversa Teste", [
    { id: "8c799f0d-957d-42ec-a568-27528f831535", tipo: "admin" },
    { id: "d6af71ae-b437-419c-927a-26a5da175bf6", tipo: "sindico" }
  ]);
  console.log("Conversa criada:", novaConversa.id);
  process.exit(0);
};

run();
