import AlertasService from "../services/AlertasService.js";

export default class AlertasController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertas(page, limit);
        return reply.status(200).send(alertas);
    }

    static async getAllAtivos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertasAtivos(page, limit);
        return reply.status(200).send(alertas);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertasResolvidos(page, limit);
        return reply.status(200).send(alertas);
    }

    static async getRecentes(req, reply) {
        const alertas = await AlertasService.getAlertasRecentes();
        return reply.status(200).send(alertas);
    }

    static async countAtivos(req, reply) {
        const alertas = await AlertasService.countAlertasAtivos();
        return reply.status(200).send(alertas);
    }

    static async countVazamentos(req, reply) {
        const alertas = await AlertasService.countAlertasDeVazamento();
        return reply.status(200).send(alertas);
    }

    static async countConsumoAlto(req, reply) {
        const alertas = await AlertasService.countAlertasDeConsumoAlto();
        return reply.status(200).send(alertas);
    }

    static async countTotalPorCasa(req, reply) {
        const alertas = await AlertasService.countTotalCasa();
        return reply.status(200).send(alertas);
    }

    static async countTotalPorApartamento(req, reply) {
        const alertas = await AlertasService.countTotalApartamento();
        return reply.status(200).send(alertas);
    }

    static async countPorCondominio(req, reply) {
        const alertas = await AlertasService.countPorCondominio();
        return reply.status(200).send(alertas);
    }

    static async countPorCasa(req, reply) {
        const { id } = req.params;
        const alertas = await AlertasService.countAlertasAtivosPorCasa(id);
        return reply.status(200).send(alertas);
    }
    
    static async countPorApartamento(req, reply) {
        const { id } = req.params;
        const alertas = await AlertasService.countAlertasAtivosPorApartamento(id);
        return reply.status(200).send(alertas);
    }

    static async resolverAlerta(req, reply) {
        const { id } = req.params;
        const alerta = await AlertasService.removerAlerta(id);
        return reply.status(200).send(alerta);
    }
}
