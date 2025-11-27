import ComunicadosService from "../services/ComunicadosService.js";

export default class ComunicadosController {
    static async getAll(req, reply) {
        const userId = req.user.id;
        const comunicados = await ComunicadosService.getAll(userId);
        return reply.status(200).send(comunicados);
    }

    static async markAsRead(req, reply) {
        const userId = req.user.id;
        const { id } = req.params;
        await ComunicadosService.marcarComoLido(userId, id);
        return reply.status(200).send({ success: true });
    }
}