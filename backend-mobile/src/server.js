import dotenv from 'dotenv';
import { resolve } from "path";
dotenv.config({ path: resolve("..", ".env") });
import app from "./app.js";
import { connectDB } from "./config/sequelize.js";

const PORT = process.env.PORT || 3333;

const start = async () => {
    try {
        await connectDB();
        await app.listen({
            host: '0.0.0.0', port: PORT
        })
        console.log(`Server Mobile listening on ${PORT}`);
    } catch (error){
        console.error(error);
        process.exit(1);
    }
}

start();