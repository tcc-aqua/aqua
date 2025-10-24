import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody'

import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import condominioRoutes from './routes/condominio.routes.js';
import unidadesRoutes from './routes/apartamento.routes.js'
import casaRoutes from './routes/casa.routes.js';
import sensorRoutes from './routes/sensor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
})

await fastify.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
})      

fastify.register(fastifyFormbody);      

fastify.get('/', (req, reply) => {
    return reply.status(200).send('Hello API!')
})

await fastify.register(userRoutes, {prefix: '/api/users'});
await fastify.register(condominioRoutes, {prefix: '/api/condominios'});
await fastify.register(unidadesRoutes, {prefix: '/api/unidades'});
await fastify.register(casaRoutes, {prefix: '/api/casas'});
await fastify.register(sensorRoutes, {prefix: '/api/sensores'});
await fastify.register(adminRoutes, {prefix: '/api/admins'});
await fastify.register(authRoutes, {prefix: '/api/auth'});
await fastify.register(errorHandler);

export default fastify;