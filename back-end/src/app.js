import Fastify from 'Fastify';

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

export default fastify;