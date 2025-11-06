import CepController from "../controllers/CepController.js";

export default async function cepRoutes(fastify) {
  fastify.get("/:cep", CepController.buscarCep);
}