import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") });

import { Sequelize } from "sequelize";

// escolhe host e porta com base no ambiente
const dbHost = process.env.DB_ENV === "docker"
  ? process.env.DB_HOST_DOCKER
  : process.env.DB_HOST_LOCAL;

const dbPort = process.env.DB_ENV === "docker"
  ? Number(process.env.DB_PORT_DOCKER)
  : Number(process.env.DB_PORT_LOCAL);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: dbHost,
    port: dbPort,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!!');
    await sequelize.sync();
    console.log('Tabelas sincronizadas com o banco!');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
};

export default sequelize;
