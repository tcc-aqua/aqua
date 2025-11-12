import CepController from "../controllers/CepController.js";

export default async function cepRoutes(fastify) {
  fastify.get("/:cep",
    {
      schema: {
        summary: "API CEP",
        tags: ['cep'],
        descriptio: 'API para completar o cep automaticamente'
      }
    },
    CepController.buscarCep);
}