import UserAlertService from "../services/relatorios/getConsumoAlto.js";
import UserConsumoMedio from "../services/relatorios/getConsumoMensal.js";

export default class RelatorioController {

    static async getUsersComConsumoAlto(req, reply) {
        const sindicoId = req.user.id;
        const consumo_alto = await UserAlertService.getUsersWithHighConsumptionAlert(sindicoId);
        return reply.status(200).send({ quantidade: consumo_alto });
    }

    static async getConsumoMedio(req, reply) {
        const sindicoId = req.user.id;
        const consumoMedio = await UserConsumoMedio.getConsumoMedio(sindicoId);
        return reply.status(200).send({ consumo_medio: consumoMedio });
    }
}