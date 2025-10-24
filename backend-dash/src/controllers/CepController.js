import CepService from "../services/CepService.js";

export default class CepController {

    static async buscarCep(req, reply) {
        const { cep } = req.params;

        // salvando cep limpo
        const cepLimpo = cep.replace(/\D/g, '');

        if (!/^\d{8}$/.test(cepLimpo)) {
            return reply.status(400).send({ error: 'CEP inválido' });
        }

        const endereco = await CepService.buscarCep(cepLimpo);
        return reply.send(endereco);
    }
}
