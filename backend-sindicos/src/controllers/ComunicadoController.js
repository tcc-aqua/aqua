import addComunicadoService from "../services/comunicados/addComunicado.js";
import getComunicadosService from "../services/comunicados/getComunicado.js";

export default class ComunicadosController {
    static async getAllComunicados(req, reply) {
        const sindico_id = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const comunicados = await getComunicadosService.getAllComunicados(page, limit, sindico_id);
        return reply.status(200).send(comunicados)
    }

    static async addComunicado(req, reply) {
        const comunicado = await addComunicadoService.createComunicado();
        return reply.status(200).send(comunicado)
    }
}