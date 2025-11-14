import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") }); 

import app from "./app.js";
import { connectDB } from "./config/sequelize.js";

const PORT = 8080;

const start = async () => {
    try {
        await connectDB();               

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