import LeituraSensorService from "../services/LeituraSensor.js";

export default class LeituraSensorController {

    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const leitura = await LeituraSensorService.getAll(page, limit);
        return reply.status(200).send(leitura);
    }

}