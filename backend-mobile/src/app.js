// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\app.js
// CÓDIGO COMPLETO E ATUALIZADO

import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import { fastifySwagger } from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import pino from 'pino'
import fs from 'fs'

import authRoutes from './routes/auth.routes.js';
import apartamentoRoutes from './routes/apartamento.routes.js';
import dicaRoutes from './routes/dica.routes.js';
import userRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import cepRoutes from './routes/cep.routes.js';
import metasRoutes from './routes/metas.routes.js';
import profileRoutes from './routes/profile.routes.js';
// =====> INÍCIO DA ALTERAÇÃO
import casaRoutes from './routes/casa.routes.js'; // 1. Importa a nova rota de casas
// =====> FIM DA ALTERAÇÃO

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs')

// cria log diário
const date = new Date().toISOString().slice(0, 10)
const filePath = `./logs/${date}.log`
const fileStream = fs.createWriteStream(filePath, { flags: 'a' })

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    },
})

const multiStream = pino.multistream([
    { stream: prettyTransport },
    { stream: fileStream },
])

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

await fastify.register(cors, {
    origin: '*', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(fastifyFormbody);

// docs api
await fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Aqua API Mobile',
            version: '1.0.0',
            description: 'Documentação da nossa API Mobile do Sistema Aqua.'
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
    return reply.status(200).send('Hello Mobile!')
})


fastify.register(authRoutes, {prefix: '/api/auth'});
fastify.register(apartamentoRoutes, {prefix: '/api/apartamentos'});
// =====> INÍCIO DA ALTERAÇÃO
fastify.register(casaRoutes, {prefix: '/api/casas'}); // 2. Registra a rota para o prefixo /api/casas
// =====> FIM DA ALTERAÇÃO
fastify.register(dicaRoutes, {prefix: '/api/dica'});
fastify.register(userRoutes, {prefix: '/api/user'});
fastify.register(metasRoutes, {prefix: '/api/metas'});
fastify.register(cepRoutes, {prefix: '/api/cep'});
fastify.register(profileRoutes, {prefix: '/api/profile'});
fastify.register(passwordRoutes, {prefix: '/api/password'});

export default fastify;