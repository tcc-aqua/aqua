import MetasService from "../services/MetasService.js";

export default class MetasController {
    static async getAll(req, reply){
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const metas = await MetasService.getAllMetas(page, limit);
        return reply.status(200).send(metas);
    }

    static async create(req, reply){
        const meta = await MetasService.createMeta(req.body);
        return reply.status(201).send(meta)
    }
}