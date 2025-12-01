import SuporteService from '../services/suporte/getCards.js';

export default class SuporteController {
    static async countMensagensRecebidas(req, reply) {
        const userId = req.user.id;
        const condominioId = req.user.condominio_id;

        try {
            const total = await SuporteService.getMensagensRecebidasCount(userId, condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens recebidas:", error.message);
            // Retorna a mensagem de erro lançada pelo Service
            return reply.status(500).send({ message: error.message });
        }
    }

    static async countMensagensEnviadas(req, reply) {
        const userId = req.user.id;

        try {
            const total = await SuporteService.getMensagensEnviadasCount(userId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens enviadas:", error.message);
            return reply.status(500).send({ message: error.message });
        }
    }
    static async countTotalInteracoes(req, reply) {
        const userId = req.user.id;
        const condominioId = req.user.condominio_id;

        try {
            const total = await SuporteService.getTotalInteracoesCount(userId, condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar total de interações:", error.message);
            return reply.status(500).send({ message: error.message });
        }
    }

    static async countMensagensAdministrativo(req, reply) {
        const condominioId = req.user.condominio_id;

        try {
            const total = await SuporteService.getMensagensAdministrativoCount(condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens do administrativo:", error.message);
            return reply.status(500).send({ message: error.message });
        }
    }
}