import UnidadeService from "../services/UnidadeService.js";

export default class UnidadeController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const unidades = await UnidadeService.getAllUnidades(page, limit);
        return reply.status(200).send(unidades);
    }

    static async getAllAtivos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const unidades = await UnidadeService.getAllUnidadesAtivas(page, limit);
        return reply.status(200).send(unidades);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const unidades = await UnidadeService.getAllUnidadesInativas(page, limit);
        return reply.status(200).send(unidades);
    }

    static async count(req, reply) {
        const unidades = await UnidadeService.countUnidades();
        return reply.status(200).send(unidades);
    }

    static async inativar(req, reply) {
        const {id} = req.params;
        const unidade = await UnidadeService.inativarUnidade(id);
        return reply.status(200).send(unidade);
    }

}