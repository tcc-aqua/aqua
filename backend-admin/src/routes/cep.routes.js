import CepController from "../controllers/CepController.js";

export default async function cepRoutes(fastify) {
  fastify.get('/:cep', {
    schema: {
      summary: 'Integrando api externa do Viacep',
      tags: ['cep'],
      description: 'API de cep'
    }
  }, CepController.buscarCep);
}
