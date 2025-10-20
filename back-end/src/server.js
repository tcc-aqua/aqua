import fastify from "./app.js";
const PORT = 3333;

const start = async () => {
    try {
      await fastify.listen({ port: PORT })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()