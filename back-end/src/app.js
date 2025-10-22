import Fastify from 'fastify';
import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import condominioRoutes from './routes/condominio.routes.js';
import unidadesRoutes from './routes/unidade.routes.js'
import casaRoutes from './routes/casa.routes.js';
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
await fastify.register(condominioRoutes, {prefix: '/api/condominios'});
await fastify.register(unidadesRoutes, {prefix: '/api/unidades'});
await fastify.register(casaRoutes, {prefix: '/api/casas'});
await fastify.register(errorHandler);

export default fastify;