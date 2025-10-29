export default async function errorHandler(fastify) {
  fastify.setErrorHandler((err, req, reply) => {
    // Log detalhado (mas ainda seguro)
    fastify.log.error({
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      params: req.params,
      body: req.body,
    });

    // Tratamento de erros de validação (ex: Zod, SequelizeValidationError)
    if (err.name === "ZodError") {
      return reply.status(400).send({
        message: "Erro de validação dos dados",
        issues: err.errors,
      });
    }

    if (err.name === "SequelizeValidationError") {
      return reply.status(400).send({
        message: "Erro de validação no banco de dados",
        details: err.errors.map((e) => e.message),
      });
    }

    if (err.name === "SequelizeUniqueConstraintError") {
      return reply.status(409).send({
        message: "Registro já existe (violação de chave única)",
      });
    }

    // Erros de autenticação/autorização
    if (err.statusCode === 401) {
      return reply.status(401).send({ message: "Não autorizado" });
    }

    if (err.statusCode === 403) {
      return reply.status(403).send({ message: "Acesso negado" });
    }

    // Erro genérico
    const status = err.statusCode || 500;
    const message =
      err.message && status !== 500
        ? err.message
        : "Erro interno do servidor";

    reply.status(status).send({ message });
  });
}
