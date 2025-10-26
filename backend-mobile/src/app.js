import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody'

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
    return reply.status(200).send('Hello API MOBILE!')
})


export default fastify;