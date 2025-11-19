import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") }); 

import fastify, { createSocketServer } from "./app.js";
import { connectDB } from "./config/sequelize.js";
import Admin from "./models/Admin.js"; 

const PORT = process.env.PORT || 3333;

// dados mockados de um admin padrão...
const criarSuperadminPadrao = async () => {
    const existe = await Admin.findOne({ where: { email: 'aqua@gmail.com' } });

    if (!existe) {
        await Admin.create({
            email: 'aqua@gmail.com',
            password: 'admin123', 
            type: 'superadmin',
        });
        console.log(' Superadmin criado automaticamente!');
    } else {
        console.log(' Superadmin já existe.');
    }
};

const start = async () => {
    try {
        console.log("URL DO REDIS:", process.env.REDIS_URL);
        await connectDB();               
        await criarSuperadminPadrao();     

        await fastify.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        // Inicia Socket.io no servidor do Fastify
        createSocketServer(fastify.server);
    } catch (error) {
        console.error(' Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

start();
