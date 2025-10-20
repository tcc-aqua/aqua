import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") });

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    { 
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    })

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!!.');

    await sequelize.sync(); 
    console.log('Tabelas sincronizadas com o banco!');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
};

export default sequelize;