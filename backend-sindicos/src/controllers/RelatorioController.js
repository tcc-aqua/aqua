import UserStatusService from "../services/relatorios/getComparacaoUsuarios.js";
import UserAlertService from "../services/relatorios/getConsumoAlto.js";
import UserConsumoMedio from "../services/relatorios/getConsumoMensal.js";
import MediaMoradores from "../services/relatorios/getMediaMoradores.js";
import QtdApartamentos from "../services/relatorios/getQtdApartamentos.js";
import StatusSensores from "../services/relatorios/getStatusSensores.js";
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

    static async getSensoresStatus(req, reply) {
        const sindicoId = req.user.id;
        const statusSensores = await StatusSensores.getSensoresStatus(sindicoId);
        return reply.status(200).send(statusSensores);
    }

    static async getUsuariosStatusSemana(req, reply) {
        const sindicoId = req.user.id; 
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1); 

        const statusSemana = await UserStatusService.getUsuariosStatusPorSemana(
            sindicoId,
            inicioSemana
        );

        return reply.status(200).send(statusSemana);
    }

    static async getMediaMoradores(req, reply) {
          const sindicoId = req.user.id;
          const media = await MediaMoradores.getMediaMoradoresPorApartamento(sindicoId);
    
          return reply.status(200).send({ media_moradores: media });
        }
}