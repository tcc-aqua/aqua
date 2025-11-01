import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import fastifyFormbody from '@fastify/formbody'
import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import condominioRoutes from './routes/condominio.routes.js';
import unidadesRoutes from './routes/apartamento.routes.js'
import casaRoutes from './routes/casa.routes.js';
import sensorRoutes from './routes/sensor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import residenciaRoutes from './routes/residencia.routes.js';
import alertasRoutes from './routes/alertas.routes.js';
import cepRoutes from './routes/cep.routes.js';


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

// docs api
await fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Aqua API',
            version: '1.0.0',
            description: 'Documentação da nossa API administrativa do Sistema Aqua.'
        },
    }
});

await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
    initOAuth: {},
});

fastify.get('/api', {
    schema: {
        tags: ['Health Check'],
        summary: 'Status da API',
        description: 'Verifica se a API está online e respondendo',
        response: {
            200: {
                type: 'string',
                example: 'Hello API'
            }
        }
    }
}, (req, reply) => {
    return reply.status(200).send('Hello API!')
})

await fastify.register(userRoutes, { prefix: '/api/users' });
await fastify.register(condominioRoutes, { prefix: '/api/condominios' });
await fastify.register(unidadesRoutes, { prefix: '/api/apartamentos' });
await fastify.register(casaRoutes, { prefix: '/api/casas' });
await fastify.register(sensorRoutes, { prefix: '/api/sensores' });
await fastify.register(adminRoutes, { prefix: '/api/admins' });
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(residenciaRoutes, { prefix: '/api/residencias' });
await fastify.register(alertasRoutes, { prefix: '/api/alertas' });
await fastify.register(cepRoutes, { prefix: '/api/cep' });
await fastify.register(errorHandler);

export default fastify;