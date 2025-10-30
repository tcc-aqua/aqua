import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") }); 

import app from "./app.js";
import { connectDB } from "./config/sequelize.js";
import Admin from "./models/Admin.js"; // ✅ importe o model

const PORT = 3333;

const criarSuperadminPadrao = async () => {
    const existe = await Admin.findOne({ where: { email: 'admin@empresa.com' } });

    if (!existe) {
        await Admin.create({
            email: 'admin@empresa.com',
            password: 'admin123', // o hook no model já vai criptografar
            type: 'superadmin',
        });
        console.log('✅ Superadmin criado automaticamente!');
    } else {
        console.log('ℹ️ Superadmin já existe.');
    }
};

const start = async () => {
    try {
        await connectDB();               
        await criarSuperadminPadrao();     

        await app.listen({
            host: '0.0.0.0',
            port: PORT
        });

        console.log(`🚀 HTTP Server rodando na porta ${PORT}`);
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

start();
