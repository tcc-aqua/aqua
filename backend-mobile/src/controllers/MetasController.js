import MetasService from "../services/MetasService.js";

export default class MetasController {
    static async getAll(req, reply){
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const metas = await MetasService.getAllMetas(userId, page, limit);
            return reply.status(200).send(metas);
        } catch (error) {
            return reply.status(500).send({ error: error.message });
        }
    }

    static async create(req, reply){
        try {
            const userId = req.user.id;
            const meta = await MetasService.createMeta({ userId, data: req.body });
            return reply.status(201).send(meta);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    }

    static async update(req, reply) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const meta = await MetasService.updateMeta(id, userId, req.body);
            return reply.status(200).send(meta);
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    }

    static async delete(req, reply) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await MetasService.deleteMeta(id, userId);
            return reply.status(200).send({ message: 'Meta removida com sucesso.' });
        } catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    }
}