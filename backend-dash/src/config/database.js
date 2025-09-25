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
        console.log('Connection has been established successfully.');

        // cria as tabelas se não existirem
        await sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas com o banco!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;