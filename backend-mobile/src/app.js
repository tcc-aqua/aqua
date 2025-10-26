import fastify from 'fastify';
import userRoutes from './routes/UserRoute.js';
import enderecoRoutes from './routes/EnderecoRoute.js';
const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

app.get("/", (request, reply) => {
    return reply.status(200).send({ message: 'Hello API!!' });
})

app.register(userRoutes, { prefix: '/users' });
app.register(enderecoRoutes, { prefix: '/enderecos' });
export default app;