import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const type = process.env.DB_CONNECTION || "local"; 
const config = {
  host: type === "docker" ? process.env.DB_HOST_DOCKER : process.env.DB_HOST_LOCAL,
  port: type === "docker" ? process.env.DB_PORT_DOCKER : process.env.DB_PORT_LOCAL,
  username: type === "docker" ? process.env.DB_USER_DOCKER : process.env.DB_USER_LOCAL,
  password: type === "docker" ? process.env.DB_PASS_DOCKER : process.env.DB_PASS_LOCAL,
  database: type === "docker" ? process.env.DB_NAME_DOCKER : process.env.DB_NAME_LOCAL,
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: false,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso.');

    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com o banco!');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  }
};

export default sequelize;
