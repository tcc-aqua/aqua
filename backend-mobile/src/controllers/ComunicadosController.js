import ComunicadosService from "../services/ComunicadosService.js";

export default class ComunicadosController {
    static async getAll(req, reply) {
        const comunicados = await ComunicadosService.getAll();
        return reply.status(200).send(comunicados);
    }
}
