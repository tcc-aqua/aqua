import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';

const fastify = Fastify({ logger: true });

await fastify.register(fastifySocketIO, {
  cors: { origin: '*' },
});

// Evento de conexão
fastify.io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Usuário ${userId} entrou na sala ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Rota de teste
fastify.get('/', async () => ({ message: 'Servidor Fastify + Socket.IO funcionando!' }));

await fastify.listen({ port: 3000 });
