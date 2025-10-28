import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody'
import authRoutes from './routes/auth.routes.js';
import apartamentoRoutes from './routes/apartamento.routes.js';
import dicaRoutes from './routes/dica.routes.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
})

await fastify.register(cors, {
    origin: 'http://localhost:8081', // Mude 4000 para 8081
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
})

fastify.register(fastifyFormbody);

fastify.get('/', (req, reply) => {
    return reply.status(200).send('Hello API MOBILE!')
})

fastify.register(authRoutes, {prefix: '/api/auth'});
fastify.register(apartamentoRoutes, {prefix: '/api/apartamentos'});
fastify.register(dicaRoutes, {prefix: '/api/dica'});


export default fastify;