import AlertasService from "../services/AlertasService.js";

export default class AlertasController {


    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertas(page, limit);
        return reply.status(200).send(alertas);
    }
    
    static async getAllAtivos(req, reply){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertasAtivos(page, limit);
        return reply.status(200).send(alertas);
    }

    static async getAllInativos(req, reply){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const alertas = await AlertasService.getAllAlertasResolvidos(page, limit);
        return reply.status(200).send(alertas);
    }

    static async countAtivos(req, reply){
        const alertas = await AlertasService.countAlertasAtivos();
        return reply.status(200).send(alertas);
    }

    static async countTotalPorCasa(req, reply){
        const alerta = await AlertasService.countTotalCasa();
        reply.status(200).send(alerta);
    }

}