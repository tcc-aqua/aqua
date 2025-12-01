import SuporteService from '../services/suporte/getCards.js';

export default class SuporteController {

    static async countMensagensRecebidas(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getMensagensRecebidasCount(userId);
        return reply.status(200).send({ total });
    }
    static async countMensagensEnviadas(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getMensagensEnviadasCount(userId);
        return reply.status(200).send({ total });
    }

    static async countTotalInteracoes(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getTotalInteracoesCount(userId);
        return reply.status(200).send({ total });
    }

    static async countMensagensAdministrativo(request, reply) {
        const total = await SuporteService.getMensagensAdministrativoCount();
        return reply.status(200).send({ total });
    }
}