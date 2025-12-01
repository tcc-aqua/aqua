import SuporteService from '../services/suporte/getCards.js';

export default class SuporteController {

    static async countMensagensRecebidas(request, reply) {
        const userId = request.user.id;
        const condominioId = request.user.condominio_id;

        if (!condominioId) {
            return reply.status(400).send({ 
                message: "O ID do condomínio ('condominio_id') não foi encontrado para o usuário logado. Verifique o token de autenticação." 
            });
        }

        try {
            const total = await SuporteService.getMensagensRecebidasCount(userId, condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens recebidas:", error);
            return reply.status(500).send({ message: "Falha interna ao obter contagem de mensagens recebidas." });
        }
    }

    static async countMensagensEnviadas(request, reply) {
        const userId = request.user.id;

        try {
            const total = await SuporteService.getMensagensEnviadasCount(userId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens enviadas:", error);
            return reply.status(500).send({ message: "Falha interna ao obter contagem de mensagens enviadas." });
        }
    }

    static async countTotalInteracoes(request, reply) {
        const userId = request.user.id;
        const condominioId = request.user.condominio_id;

        if (!condominioId) {
            return reply.status(400).send({ 
                message: "O ID do condomínio ('condominio_id') não foi encontrado para o usuário logado." 
            });
        }
        
        try {
            const total = await SuporteService.getTotalInteracoesCount(userId, condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar total de interações:", error);
            return reply.status(500).send({ message: "Falha interna ao obter contagem total de interações." });
        }
    }

    static async countMensagensAdministrativo(request, reply) {
        const condominioId = request.user.condominio_id;

        if (!condominioId) {
            return reply.status(400).send({ 
                message: "O ID do condomínio ('condominio_id') não foi encontrado para o usuário logado." 
            });
        }
        
        try {
            const total = await SuporteService.getMensagensAdministrativoCount(condominioId);
            return reply.status(200).send({ total });
        } catch (error) {
            console.error("Erro no Controller ao contar mensagens administrativas:", error);
            return reply.status(500).send({ message: "Falha interna ao obter contagem de mensagens administrativas." });
        }
    }
}