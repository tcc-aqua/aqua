import ResidenciaService from "../services/ResidenciaService.js";

export default class ResidenciaController {

    static async getAll(req, reply) {
        const residencias = await ResidenciaService.getAllResidencias();
        return reply.status(200).send(residencias)
    }

    static async getPorEstado(req, reply) {
        const residencias = await ResidenciaService.getAllDistribuicaoPorUf();
        return reply.status(200).send(residencias);
    }

}