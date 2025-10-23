import UnidadeService from "../services/UnidadeService.js";

export default class UnidadeController {

    static async getAll(req, reply) {
        const unidades = await UnidadeService.getAllUnidades();
        return reply.status(200).send(unidades);
    }

    static async getAllAtivos(req, reply) {
        const unidades = await UnidadeService.getAllUnidadesAtivas();
        return reply.status(200).send(unidades);
    }

    static async getAllInativos(req, reply) {
        const unidades = await UnidadeService.getAllUnidadesInativas();
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