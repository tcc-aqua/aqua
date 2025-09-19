import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "./config/database.js";
import app from './app.js'

const PORT = process.env.PORT || 3333;

const start = async () => {
    try {
        await connectDB(); // host 0.0.0.0 to docker
        await app.listen({ host: '0.0.0.0', port: PORT });
        console.log(`Server listening on port ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();