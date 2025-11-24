import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import pino from 'pino'
import fs from 'fs'
import fastifyFormbody from '@fastify/formbody'
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import authRoutes from './routes/auth.routes.js';
import moradoresRoutes from './routes/moradores.routes.js';
import comunicadosRoutes from './routes/comunicados.routes.js';
import relatorioRoutes from './routes/relatorios.routes.js';

if (!fs.existsSync('./logs')) fs.mkdirSync('./logs')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// conectar ao Redis


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
        level: 'info',
        stream: multiStream,
    }
})


await fastify.register(cors, {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
})

fastify.register(fastifyFormbody);

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

// routes
await fastify.register(userRoutes, { prefix: '/api/users' })
await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' })
await fastify.register(authRoutes, { prefix: '/api/auth' })
await fastify.register(moradoresRoutes, { prefix: '/api/moradores' })
await fastify.register(comunicadosRoutes, { prefix: '/api/comunicados' })
await fastify.register(relatorioRoutes, { prefix: '/api/relatorios' })

export default fastify;