import fastify from "fastify";
import userRoutes from "./routes/userRoutes.js";
import enderecoRoutes from './routes/enderecoRoutes.js'

const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

app.get('/', (request, reply) => {
    return reply.status(200).send({ message: "Hello World!!!" });
})

await userRoutes(app);
await enderecoRoutes(app);

export default app;