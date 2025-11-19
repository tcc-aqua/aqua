import dotenv from "dotenv";
dotenv.config({ path: resolve("..", ".env") }); 
import { resolve } from "path";

import fastify, { createSocketServer } from "./app.js";
import { connectDB } from "./config/sequelize.js";
import User from "./models/User.js";

const PORT = process.env.PORT || 8080;

// Criação automática do síndico
const criaSindico = async () => {
    const existe = await User.findOne({ where: { email: "paiva@gmail.com" } });

    if (!existe) {
        await User.create({
            name: "Gustavo Paiva",
            cpf: "111.121.111-11",
            email: "paiva@gmail.com",
            type: "condominio",
            password: "paiva123",
            residencia_type: "apartamento",
            role: "sindico",
        });

        console.log("Síndico criado automaticamente!");
    } else {
        console.log("Síndico já existe.");
    }
};

const start = async () => {
    try {
        console.log("URL DO REDIS:", process.env.REDIS_URL);

        // Conecta ao banco
        await connectDB();

        // Cria síndico
        await criaSindico();

        // Inicia Fastify corretamente
        await fastify.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        // Inicia Socket.io no servidor do Fastify
        createSocketServer(fastify.server);

        console.log(` Servidor rodando na porta ${PORT}`);
    } catch (error) {
        console.error(" Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};

start();
