import UserAlertService from "../services/relatorios/getConsumoAlto.js";
import UserConsumoMedio from "../services/relatorios/getConsumoMensal.js";
import QtdApartamentos from "../services/relatorios/getQtdApartamentos.js";
import GetVazamentos from "../services/relatorios/getVazamento.js";

export default class RelatorioController {

    static async getUsersComConsumoAlto(req, reply) {
        const sindicoId = req.user.id;
        const consumo_alto = await UserAlertService.getUsersWithHighConsumptionAlert(sindicoId);
        return reply.status(200).send({ quantidade: consumo_alto });
    }

    static async getUsersComVazamento(req, reply) {
        const sindicoId = req.user.id;
        const vazamento = await GetVazamentos.getUsersComVazamento(sindicoId);
        return reply.status(200).send({ quantidade: vazamento });
    }

    static async getConsumoMedio(req, reply) {
        const sindicoId = req.user.id;
        const consumoMedio = await UserConsumoMedio.getConsumoMedio(sindicoId);
        return reply.status(200).send({ consumo_medio: consumoMedio });
    }

    static async getNumeroApartamentos(req, reply) {
        const sindicoId = req.user.id; 
        const numeroApartamentos = await QtdApartamentos.getNumeroApartamentos(sindicoId);

        return reply.status(200).send({ numero_apartamentos: numeroApartamentos });
    }
}