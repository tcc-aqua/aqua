import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import authRoutes from './routes/auth.routes.js';
import apartamentoRoutes from './routes/apartamento.routes.js';
import dicaRoutes from './routes/dica.routes.js';
import userRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
// --- ADIÇÃO 1/2: Importar o novo arquivo de rotas do CEP ---
import cepRoutes from './routes/cep.routes.js';
import metasRoutes from './routes/metas.routes.js';

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

await fastify.register(cors, {
    origin: '*', // Recomenda-se ser mais específico em produção
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(fastifyFormbody);

fastify.get('/', (req, reply) => {
    return reply.status(200).send('Hello API MOBILE!');
});

fastify.register(authRoutes, {prefix: '/api/auth'});
fastify.register(apartamentoRoutes, {prefix: '/api/apartamentos'});
fastify.register(dicaRoutes, {prefix: '/api/dica'});
fastify.register(userRoutes, {prefix: '/api/user'});
fastify.register(passwordRoutes, {prefix: '/api/forgot'});
fastify.register(metasRoutes, {prefix: '/api/metas'});

// --- ADIÇÃO 2/2: Registrar a rota do CEP com o prefixo /api ---
fastify.register(cepRoutes, {prefix: '/api/cep'});

export default fastify;