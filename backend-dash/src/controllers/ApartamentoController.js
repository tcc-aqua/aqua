import ApartamentoService from "../services/ApartamentoService.js";

export default class ApartamentoController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const apartamentos = await ApartamentoService.getAllApartamentos(page, limit);
        return reply.status(200).send(apartamentos);
    }

    static async getAllAtivos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const apartamentos = await ApartamentoService.getAllApartamentosAtivos(page, limit);
        return reply.status(200).send(apartamentos);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const apartamentos = await ApartamentoService.getAllApartamentosInativos(page, limit);
        return reply.status(200).send(apartamentos);
    }

    static async count(req, reply) {
        const apartamentos = await ApartamentoService.countUnidades();
        return reply.status(200).send(apartamentos);
    }

    static async inativar(req, reply) {
        const {id} = req.params;
        const apartamento = await ApartamentoService.inativarApartamento(id);
        return reply.status(200).send(apartamento);
    }

    static async ativar(req, reply) {
        const {id} = req.params;
        const apartamento = await ApartamentoService.ativarApartamento(id);
        return reply.status(200).send(apartamento);
    }

}