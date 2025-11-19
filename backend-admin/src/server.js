import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") }); 

import app, { server } from "./app.js";
import { connectDB } from "./config/sequelize.js";
import Admin from "./models/Admin.js"; 

const PORT = 3333;

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
