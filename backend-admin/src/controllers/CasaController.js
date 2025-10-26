import CasaService from "../services/CasaService.js";

export default class CasaController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const casas = await CasaService.getAllHouses(page, limit);
        return reply.status(200).send(casas);
    }

    static async getAllAtivos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const casas = await CasaService.getAllHousesAtivas(page, limit);
        return reply.status(200).send(casas);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const casas = await CasaService.getAllHousesInativas(page, limit);
        return reply.status(200).send(casas);
    }

    static async count(req, reply) {
        const casas = await CasaService.countHouses();
        return reply.status(200).send(casas);
    }

    static async countAtivas(req, reply) {
        const casas = await CasaService.countHousesAtivas();
        return reply.status(200).send(casas);
    }

    static async inativar(req, reply) {
        const { id } = req.body;
        const casa = await CasaService.inativarCasa(id);
        return reply.status(200).send(casa);
    }

    static async ativar(req, reply) {
        const { id } = req.body;
        const casa = await CasaService.ativarCasa(id);
        return reply.status(200).send(casa);
    }



}