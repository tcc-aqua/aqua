import dotenv from 'dotenv';
dotenv.config({ path: resolve("..", ".env") }); 
import { resolve } from "path";

import app, { server } from "./app.js"; // note o 'server' exportado
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
        console.log("URL DO REDIS:", process.env.REDIS_URL);
        await connectDB();               
        await criaSindico();     
        
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`HTTP Server rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error(' Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

start();
