import CepService from "../services/CepService.js";

export default class CepController {

    static async buscarCep(req, reply) {
        try {
            const { cep } = req.params;
            const cepLimpo = cep.replace(/\D/g, '');

            if (!/^\d{8}$/.test(cepLimpo)) {
                return reply.status(400).send({ error: 'Formato de CEP inválido. Use 8 dígitos.' });
            }

            // Chama o serviço para buscar o endereço.
            const endereco = await CepService.buscarCep(cepLimpo);

            // Se o serviço retornou um endereço (não é null), envia 200 OK.
            if (endereco) {
                return reply.status(200).send(endereco);
            } 
            // Se o serviço retornou null, significa que o CEP não foi encontrado.
            // Enviamos uma resposta 404 Not Found, que é o correto.
            else {
                return reply.status(404).send({ error: 'CEP não encontrado.' });
            }

        } catch (error) {
            // Este catch agora só será ativado por erros realmente inesperados.
            console.error("Erro inesperado no CepController:", error);
            return reply.status(500).send({ error: 'Ocorreu um erro interno ao processar a solicitação.' });
        }
    }
}