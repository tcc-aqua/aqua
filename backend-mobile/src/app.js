import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody'
import authRoutes from './routes/auth.routes.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
})

await fastify.register(cors, {
    origin: 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
})

fastify.register(fastifyFormbody);

fastify.get('/', (req, reply) => {
    return reply.status(200).send('Hello API MOBILE!')
})

fastify.register(authRoutes, {prefix: '/api/auth'})


export default fastify;