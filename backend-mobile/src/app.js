import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import { fastifySwagger } from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import pino from 'pino';
import fs from 'fs';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import apartamentoRoutes from './routes/apartamento.routes.js';
import dicaRoutes from './routes/dica.routes.js';
import userRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import cepRoutes from './routes/cep.routes.js';
import metasRoutes from './routes/metas.routes.js';
import profileRoutes from './routes/profile.routes.js';
import comunicadosRoutes from './routes/comunicados.routes.js';
import casaRoutes from './routes/casa.routes.js';
import condominioRoutes from './routes/condominio.routes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.resolve(__dirname, '..', 'uploads');
const logsPath = path.resolve(__dirname, '..', 'logs');

console.log('------------------------------------------------');
console.log('📁 SERVIDOR DE IMAGENS LENDO DE:', uploadsPath);
console.log('------------------------------------------------');

if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true });
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const date = new Date().toISOString().slice(0, 10);
const filePath = path.join(logsPath, `${date}.log`);
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    },
});

const multiStream = pino.multistream([
    { stream: prettyTransport },
    { stream: fileStream },
]);

const fastify = Fastify({
    logger: {
        level: 'info',
        stream: multiStream
    }
});

await fastify.register(cors, {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(fastifyFormbody);
await fastify.register(multipart);

fastify.register(fastifyStatic, {
    root: uploadsPath,
    prefix: '/api/uploads/',
    list: false,
});

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

fastify.get('/api', (req, reply) => {
    return reply.status(200).send('Hello Mobile!');
});

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(apartamentoRoutes, { prefix: '/api/apartamentos' });
fastify.register(casaRoutes, { prefix: '/api/casas' });
fastify.register(dicaRoutes, { prefix: '/api/dica' });
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(metasRoutes, { prefix: '/api/metas' });
fastify.register(cepRoutes, { prefix: '/api/cep' });
fastify.register(profileRoutes, { prefix: '/api/profile' });
fastify.register(passwordRoutes, { prefix: '/api/password' });
fastify.register(comunicadosRoutes, { prefix: '/api/comunicados' });
fastify.register(condominioRoutes, { prefix: '/api/condominios' });

export default fastify;