// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\server.js
// CÓDIGO COMPLETO E CORRIGIDO

import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") });
import app from "./app.js";
import { connectDB } from "./config/sequelize.js";
import { initializeAssociations } from './models/index.js'; // Importa a função de associações

const PORT = 3334;

const start = async () => {
    try {
        // 1. Conecta ao banco de dados primeiro
        await connectDB();
        
        // 2. Depois de conectar, inicializa as associações dos modelos
        initializeAssociations();
        console.log('Associações entre modelos foram inicializadas com sucesso!');

        // 3. Finalmente, inicia o servidor
        await app.listen({
            host: '0.0.0.0', port: PORT
        });
        
        // A mensagem de "Server listening" agora é mais precisa
        
    } catch (error){
        console.error('Erro fatal ao iniciar o servidor:', error);
        process.exit(1);
    }
}

start();