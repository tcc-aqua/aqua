import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") }); 
import http from "http";
import { Server } from "socket.io";
import chatSocket from "./sockets/ChatSocket.js";

import app from "./app.js";
import { connectDB } from "./config/sequelize.js";
import User from './models/User.js';

const PORT = process.env.PORT || 8080;

const criaSindico = async () => {
    const existe = await User.findOne({ where: { email: 'paiva@gmail.com' } });

    if (!existe) {
        await User.create({
            name: "Gustavo Paiva",
            cpf: '111.121.111-11',
            email: 'paiva@gmail.com',
            type: 'condominio',
            password: 'paiva123', 
            residencia_type: 'apartamento',
            role: 'sindico',
          });
    
        console.log('Sindico criado automaticamente!');
    } else {
        console.log('Sindico já existe.');
    }
};

const start = async () => {
    try {
        await connectDB();               
        await criaSindico();     
        await app.listen({
            host: '0.0.0.0',
            port: PORT
        });

        console.log(`HTTP Server rodando na porta ${PORT}`);
    } catch (error) {
        console.error(' Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

start();