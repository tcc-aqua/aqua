export default async function errorHandler(fastify) {
  fastify.setErrorHandler((err, req, reply) => {
    console.error(err); // log do erro completo

    const status = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    reply.status(status).send({ message });
  });
}
