import Fastify from 'fastify';
import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
})

fastify.get('/', (req, reply) => {
    return reply.status(200).send('Hello API!')
})

await fastify.register(userRoutes, {prefix: '/api/users'});
await fastify.register(errorHandler);

export default fastify;